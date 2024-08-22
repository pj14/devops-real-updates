import { WebSocket } from "ws";

export interface ClientSubscription {
    id: string;
    region: string;
    websocket: WebSocket;
}

export interface DevopsData {
    timestamp: string;
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