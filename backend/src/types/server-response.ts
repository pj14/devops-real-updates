export interface ServerResponse {
    status: string;
    region: string;
    roles: string[];
    results: {
        services: {
            redis: boolean;
            database: boolean;
        };
        stats: {
            servers_count: number;
            online: number;
            session: number;
            server: {
                active_connections: number;
                wait_time: number;
                workers: unknown[];
                cpu_load: number;
                timers: number;
            };
        };
    };
    strict: boolean;
    server_issue: unknown;
}
