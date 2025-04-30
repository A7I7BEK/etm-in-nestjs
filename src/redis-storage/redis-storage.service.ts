import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
import appConfig from 'src/common/config/app.config';

@Injectable()
export class RedisStorageService implements OnApplicationBootstrap, OnApplicationShutdown
{
    redisClient: Redis;


    onApplicationBootstrap()
    {
        this.redisClient = new Redis({
            host: appConfig().redis.host,
            port: appConfig().redis.port,
            username: appConfig().redis.username,
            password: appConfig().redis.password,
        });
    }


    onApplicationShutdown(signal?: string)
    {
        return this.redisClient.quit();
    }
}