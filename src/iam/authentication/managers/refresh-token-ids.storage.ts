import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';
import appConfig from 'src/common/config/app.config';

export class InvalidatedRefreshTokenError extends Error { }

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown
{
    private redisClient: Redis;

    onApplicationBootstrap()
    {
        /**
         * TODO: Ideally, we should move this to the dedicated "RedisModule"
         * instead of initiating the connection here
         */

        this.redisClient = new Redis({
            host: appConfig().redis.host,
            port: appConfig().redis.port,
        });
    }

    onApplicationShutdown(signal?: string)
    {
        return this.redisClient.quit();
    }


    async insert(userId: number, tokenId: string): Promise<void>
    {
        await this.redisClient.set(this.getKey(userId), tokenId);
    }

    async validate(userId: number, tokenId: string): Promise<void>
    {
        const storedId = await this.redisClient.get(this.getKey(userId));

        if (storedId !== tokenId)
        {
            throw new InvalidatedRefreshTokenError();
        }
    }

    async remove(userId: number): Promise<void>
    {
        await this.redisClient.del(this.getKey(userId));
    }

    private getKey(userId: number): string
    {
        return `user-${userId}`;
    }
}
