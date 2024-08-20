import { WebSocket } from "ws";

export interface ClientSubscription {
    region: string;
    websocket: WebSocket;
}

export interface DevopsData {
    region: string,
    redisServiceStatus: boolean;
    databaseServiceStatus: boolean;
    serverCount: number,
    onlineUsers: number,
    activeSessions: number,
    
    serverConnections: number,
    serverWaitTime: number,
    serverCPULoad: number,
    
    workers: unknown[]
}