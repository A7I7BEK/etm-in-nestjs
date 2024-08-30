import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import appConfig from 'src/common/config/app.config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService
{
    constructor (private readonly mailerService: MailerService) { }

    async sendOtpCode(user: User, code: string)
    {
        try
        {
            await this.mailerService.sendMail({
                to: user.email,
                subject: `${code} is your ${appConfig().application.name} verification code`,
                template: './confirmation',
                context: {
                    name: user.userName,
                    code,
                },
            });
        }
        catch (error)
        {
            throw new HttpException(error.response, error.responseCode);
        }
    }
}
