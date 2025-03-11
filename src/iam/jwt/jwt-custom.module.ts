import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtCustomService } from './jwt-custom.service';

@Module({
    imports: [
        JwtModule.register({
            global: true, // BINGO: JwtModule is accessible globally now
        }),
    ],
    exports: [ JwtCustomService ],
    providers: [ JwtCustomService ],
})
export class JwtCustomModule { }
