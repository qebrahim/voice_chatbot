export declare class HealthController {
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        environment: string;
    };
}
