import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import appConfig from 'src/common/config/app.config';
import { User } from 'src/users/entities/user.entity';
import { MailThrottleService } from './mail-throttle.service';

@Injectable()
export class MailService
{
    constructor (
        private readonly mailerService: MailerService,
        private readonly mailThrottleService: MailThrottleService,
    ) { }


    async sendOtpCodeEmail(email: string, code: string)
    {
        await this.mailThrottleService.checkThrottle(email);

        try
        {
            await this.mailerService.sendMail({
                to: email,
                subject: `${code} is your ${appConfig().application.name} verification code`,
                template: './confirmation-email',
                context: {
                    code,
                },
            });
        }
        catch (error)
        {
            throw new HttpException(error.response, error.responseCode);
        }

        await this.mailThrottleService.setThrottle(email);
    }


    async sendOtpCodeUser(user: User, code: string)
    {
        await this.mailThrottleService.checkThrottle(user.email);

        try
        {
            await this.mailerService.sendMail({
                to: user.email,
                subject: `${code} is your ${appConfig().application.name} verification code`,
                template: './confirmation-user',
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

        await this.mailThrottleService.setThrottle(user.email);
    }
}
