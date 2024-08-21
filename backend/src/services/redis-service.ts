import { DevopsData } from "../types/clinet-types";
import { logger } from "../utils/logger";
import { getCache } from "../utils/redis-client";


export async function cacheRegionData(devopsMetrics : DevopsData, region: string) : Promise<void>  {
    try {
        const cache = await getCache();
        const key = region;
        const value = JSON.stringify(devopsMetrics);

        await cache.set(key, value);
    } catch (error) {
        logger.error(`Error putting data to cache: ${error}`);
    }
}


export async function getCachedData(region:string): Promise<DevopsData | null> {
    try {
        const cache = await getCache();
        const key = region;

        const data = await cache.get(key);

        logger.info(`getCachedData: ${data}`);

        if(data) {
            return JSON.parse(data) as DevopsData;
        } else {
            return null;
        }
    } catch (error) {
        logger.error(`Can't fetch values from redis: ${error}`);

        return null;
    }
    
}
