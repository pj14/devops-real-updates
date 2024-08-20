import axios from "axios";
import { ServerResponse } from "../types/server-response";
import { DevopsData } from "../types/clinet-types";

export function generateRegionURL (region : string)  {
    const url = `https://data--${region}.upscope.io/status?stats=1`;

    return url;
}

export async function fetchServerData(url: string): Promise<ServerResponse> {
    const response = await axios.get<ServerResponse>(url);
    return response.data;
}

export function processServerData(data: ServerResponse) : DevopsData {
    const {region, results } = data;

    const services = results?.services;
    const stats = results?.stats;

    const serverStats = stats?.server;

    return {
        region: region,
        redisServiceStatus: services?.redis,
        databaseServiceStatus: services?.database,
        serverCount: stats?.servers_count,
        onlineUsers: stats?.online,
        activeSessions: stats?.session,
    
        serverConnections: serverStats?.active_connections,
        serverWaitTime: serverStats?.wait_time,
        serverCPULoad: serverStats?.cpu_load,
    
        workers: serverStats?.workers,
    }
}

