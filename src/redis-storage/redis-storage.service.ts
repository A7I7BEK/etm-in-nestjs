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
            family: 0, // Dual stack lookup (use IPv4 or IPv6)
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