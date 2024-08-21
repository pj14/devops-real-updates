import { WebSocket, WebSocketServer } from "ws";
import { ClientSubscription } from "../types/clinet-types";
import { fetchServerData, generateRegionURL, processServerData } from "../utils/api-utils";
import { cacheRegionData, getCachedData } from "./redis-service";
import { logger } from "../utils/logger";
import { POLLING_INTERVAL } from "../constants/constants";


export class DashboardService {
    private wss: WebSocketServer;
    private clientSubscriptions: ClientSubscription[] = [];
    private pollingInterval: NodeJS.Timeout | null = null;

    constructor(wss: WebSocketServer) {
        this.wss = wss;

        this.wss.on('connection', (websocketConnection) => {
            websocketConnection.on('message', async (message) => {
                try {
                    const data = JSON.parse(message.toString());

                    const region = data.region

                    if(region) {
                        await this.handleRegionSubscription(websocketConnection, region);
                    }
                } catch (error) {
                    console.log("Invalid message: ", error);
                }
            });

            websocketConnection.on('close', () => {
                this.handleConnectionClosing(websocketConnection);
            })
        });

        this.startPolling();
    }

    private async handleRegionSubscription(ws: WebSocket, region: string) {
        if (!this.clientSubscriptions.some(sub => sub.region === region && sub.websocket === ws)) {
            this.clientSubscriptions.push({ region, websocket: ws });
        }

        if (this.clientSubscriptions.filter(sub => sub.region === region).length === 1) {
            const data = await this.fetchRegionData(region);
            this.broadcastDataToRegionClients(region, data);
        } else {
            const cachedData = await getCachedData(region);
            if (cachedData) {
                ws.send(JSON.stringify(cachedData));
            } 
        }

        console.log("clientSubscriptions", this.clientSubscriptions.map(sub => sub.region));
    }

    private async fetchRegionData(region: string) {
        try {
            const regionURL = generateRegionURL(region);
            const serverResponse = await fetchServerData(regionURL);

            const devopsMetrics = processServerData(serverResponse);
            await cacheRegionData(devopsMetrics, region);

            return devopsMetrics;
        } catch (error) {
            console.error("Error fetching data: ", error);
            
            return null; 
        }
    } 

    private broadcastDataToRegionClients(region: string, data: unknown) {
        this.clientSubscriptions
          .filter(sub => sub.region === region)
          .forEach(sub => {
            if (data && sub.websocket.readyState === WebSocket.OPEN) {
              sub.websocket.send(JSON.stringify(data));
            }
          });
      }

    private handleConnectionClosing(ws: WebSocket) {
        this.clientSubscriptions = this.clientSubscriptions.filter(sub => sub.websocket !== ws);
    }

    private startPolling() {
        this.pollingInterval = setInterval(async () => {
            logger.info("POlling Polling on the way");
            const currentRegions = [...new Set(this.clientSubscriptions.map(sub => sub.region))];
            
            logger.info(`INterval current regions: ${currentRegions}`);

            for(const region of currentRegions) {
                const newData = await this.fetchRegionData(region);

                if(newData) {
                    this.broadcastDataToRegionClients(region, newData)
                }
            }
        }, POLLING_INTERVAL)
    }

    private stopPolling() {
        if(this.pollingInterval) {
            clearInterval(this.pollingInterval);

            this.pollingInterval = null;
        }
    }

}

