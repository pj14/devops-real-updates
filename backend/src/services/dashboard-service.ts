import { WebSocket, WebSocketServer } from "ws";
import { ClientSubscription } from "../types/clinet-types";
import { fetchServerData, generateRegionURL, processServerData } from "../utils/api-utils";


export class DashboardService {
    private wss: WebSocketServer;
    private clientSubscriptions: ClientSubscription[] = [];

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
    }

    private async handleRegionSubscription(ws: WebSocket, region: string) {
        if (!this.clientSubscriptions.some(sub => sub.region === region && sub.websocket === ws)) {
            this.clientSubscriptions.push({ region, websocket: ws });
        }

        if (this.clientSubscriptions.filter(sub => sub.region === region).length === 1) {
            const data = await this.fetchRegionData(region);
            this.broadcastDataToRegionClients(region, data);
        } 
    }

    private async fetchRegionData(region: string) {
        try {
            const regionURL = generateRegionURL(region);
            const serverResponse = await fetchServerData(regionURL);

            const devopsMetrics = processServerData(serverResponse);

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
}

