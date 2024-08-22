export interface IUseSocketProps {
    region: string | "";
}

export interface ISocketMessage {
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
    
    workers: any[]
}