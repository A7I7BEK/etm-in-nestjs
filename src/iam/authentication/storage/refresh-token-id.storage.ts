import { Injectable } from '@nestjs/common';
import appConfig from 'src/common/config/app.config';
import { RedisStorageService } from 'src/redis-storage/redis-storage.service';

export class InvalidatedRefreshTokenError extends Error { }

@Injectable()
export class RefreshTokenIdStorage
{
    constructor (
        private readonly _redisStorage: RedisStorageService,
    ) { }


    private keyName(userId: number): string
    {
        return `REFRESH_TOKEN:user-${userId}`;
    }


    async insert(userId: number, tokenId: string): Promise<void>
    {
        await this._redisStorage.redisClient.set(
            this.keyName(userId),
            tokenId,
            'EX',
            appConfig().jwt.refreshTokenTtl,
        );
    }


    async validate(userId: number, tokenId: string): Promise<void>
    {
        const storedId = await this._redisStorage.redisClient.get(this.keyName(userId));

        if (storedId !== tokenId)
        {
            throw new InvalidatedRefreshTokenError();
        }
    }


    async remove(userId: number): Promise<void>
    {
        await this._redisStorage.redisClient.del(this.keyName(userId));
    }
}
