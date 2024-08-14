import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import appConfig from 'src/common/config/app.config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService
{
    constructor (private readonly mailerService: MailerService) { }

    sendOtpCode(user: User, code: string)
    {
        return this.mailerService.sendMail({
            to: user.email,
            subject: `${code} is your ${appConfig().application.name} verification code`,
            template: './confirmation',
            context: {
                name: user.userName,
                code,
            },
        });
    }
}
