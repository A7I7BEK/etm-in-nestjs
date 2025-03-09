import { Global, Module } from '@nestjs/common';
import { RedisStorageService } from './redis-storage.service';

@Global() // BINGO: make global and let all modules access
@Module({
    exports: [ RedisStorageService ],
    providers: [ RedisStorageService ],
})
export class RedisStorageModule { }
