import { Injectable } from '@nestjs/common';
import appConfig from 'src/common/config/app.config';
import { PermissionType } from 'src/iam/authorization/permission.constants';
import { RedisStorageService } from 'src/redis-storage/redis-storage.service';


@Injectable()
export class AccessTokenPermissionStorage
{
    constructor (
        private readonly _redisStorage: RedisStorageService,
    ) { }


    private keyName(userId: number): string
    {
        return `PERMISSIONS:user-${userId}`;
    }


    async insert(userId: number, permissionCodeNames: PermissionType[]): Promise<void>
    {
        await this._redisStorage.redisClient.set(
            this.keyName(userId),
            JSON.stringify(permissionCodeNames),
            'EX',
            appConfig().jwt.accessTokenTtl,
        );
    }


    async retrieve(userId: number): Promise<PermissionType[] | null>
    {
        const permissionString = await this._redisStorage.redisClient.get(this.keyName(userId));
        return JSON.parse(permissionString);
    }


    async remove(userId: number): Promise<void>
    {
        await this._redisStorage.redisClient.del(this.keyName(userId));
    }
}
