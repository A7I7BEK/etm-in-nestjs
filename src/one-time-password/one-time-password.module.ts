import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { OneTimePasswordParent } from './entities/one-time-password-parent.entity';
import { OneTimePassword } from './entities/one-time-password.entity';
import { OneTimePasswordService } from './one-time-password.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OneTimePasswordParent,
            OneTimePassword,
        ]),
        MailModule,
    ],
    exports: [ OneTimePasswordService ],
    providers: [ OneTimePasswordService ],
})
export class OneTimePasswordModule { }