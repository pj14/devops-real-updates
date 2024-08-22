import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';
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
            const connectionId = uuidv4();
            websocketConnection.on('message', async (message) => {
                try {
                    const data = JSON.parse(message.toString());

                    const region = data.region

                    if(region) {
                    
                        await this.handleRegionSubscription(connectionId, websocketConnection, region);
                    }
                } catch (error) {
                    logger.error("Invalid message: ", error);
                }
            });

            websocketConnection.on('close', () => {
                this.handleConnectionClosing(connectionId);
                logger.info("Connection closed. Updated clientSubscriptions", this.clientSubscriptions.map(sub => sub.region));
            })
        });

        this.startPolling();
    }

    private async handleRegionSubscription(id: string, ws: WebSocket, region: string) {
        this.clientSubscriptions = this.clientSubscriptions.filter(sub => sub.id !== id);

        this.clientSubscriptions.push({ id, region, websocket: ws });

    
        const cachedData = await getCachedData(region);
        if (cachedData) {
            ws.send(JSON.stringify(cachedData));
        } else {
            const data = await this.fetchRegionData(region);
            if (data) {
                ws.send(JSON.stringify(data));
            }
        }

        logger.info("clientSubscriptions", this.clientSubscriptions.map(sub => sub.id));
    }

    private async fetchRegionData(region: string) {
        try {
            const regionURL = generateRegionURL(region);
            const serverResponse = await fetchServerData(regionURL);

            const devopsMetrics = processServerData(serverResponse);
            await cacheRegionData(devopsMetrics, region);

            return devopsMetrics;
        } catch (error) {
            logger.error("Error fetching data: ", error);
            
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

    private handleConnectionClosing(id: string) {
        this.clientSubscriptions = this.clientSubscriptions.filter(sub => sub.id !== id);
    }

    private startPolling() {
        this.pollingInterval = setInterval(async () => {
            const currentRegions = [...new Set(this.clientSubscriptions.map(sub => sub.region))];
            

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

