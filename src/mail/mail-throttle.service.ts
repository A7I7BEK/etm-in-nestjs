import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisStorageService } from 'src/redis-storage/redis-storage.service';

// BINGO: Use Redis to throttle email sending
@Injectable()
export class MailThrottleService
{
    constructor (
        private readonly _redisStorage: RedisStorageService,
    ) { }


    private readonly THROTTLE_TIME = 10; // 10 seconds


    private generateTime()
    {
        return (Date.now() + this.THROTTLE_TIME * 1000).toString();
    }


    private keyName(email: string): string
    {
        return `EMAIL_THROTTLE:email-${email}`;
    }


    async setThrottle(email: string): Promise<void>
    {
        await this._redisStorage.redisClient.set(
            this.keyName(email),
            this.generateTime(),
            'EX',
            this.THROTTLE_TIME,
        );
    }


    async checkThrottle(email: string): Promise<void>
    {
        const lastEmailSentTime = await this._redisStorage.redisClient.get(this.keyName(email));
        const now = Date.now();

        if (lastEmailSentTime && now < Number(lastEmailSentTime))
        {
            const remainingTime = Math.ceil((Number(lastEmailSentTime) - now) / 1000);

            throw new HttpException(
                `Please wait ${remainingTime} seconds before sending another email!`,
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }
    }
}
