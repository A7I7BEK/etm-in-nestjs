import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import appConfig from 'src/common/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { MAIL_ACTION_TYPE } from './constants/mail-action-type.constant';
import { MAIL_QUERY_TYPE } from './constants/mail-query-type.constant';
import { MailThrottleService } from './mail-throttle.service';


@Injectable()
export class MailService
{
    constructor (
        private readonly _mailerService: MailerService,
        private readonly _mailThrottleService: MailThrottleService,
    ) { }


    async sendConfirmationLink(userId: number, email: string, token: string)
    {
        await this._mailThrottleService.checkThrottle(userId);

        const url = new URL(appConfig().application.urlFront);
        url.searchParams.append(MAIL_QUERY_TYPE.ACTION, MAIL_ACTION_TYPE.CONFIRM_EMAIL);
        url.searchParams.append(MAIL_QUERY_TYPE.TOKEN, token);

        try
        {
            await this._mailerService.sendMail({
                to: email,
                subject: `${appConfig().application.name}: confirm your email address`,
                template: './confirm-email-via-link',
                context: {
                    url: url.toString(),
                },
            });
        }
        catch (error)
        {
            throw new HttpException(error.response, error.responseCode);
        }

        await this._mailThrottleService.setThrottle(userId);
    }


    async sendOtpCode(sender: User, code: string)
    {
        console.log('sendOtpCode-1', sender, code);
        await this._mailThrottleService.checkThrottle(sender.id);

        try
        {
            console.log('sendOtpCode-2', sender, code);
            await this._mailerService.sendMail({
                to: {
                    name: `${sender.employee.firstName} ${sender.employee.lastName}`,
                    address: sender.email,
                },
                subject: `${code} is your ${appConfig().application.name} verification code`,
                template: './confirm-email-via-code',
                context: {
                    firstName: sender.employee.firstName,
                    lastName: sender.employee.lastName,
                    code,
                },
            });
        }
        catch (error)
        {
            console.log('sendOtpCode-3', error);
            throw new HttpException(error.response, error.responseCode);
        }

        await this._mailThrottleService.setThrottle(sender.id);
        console.log('sendOtpCode-4');
    }


    async shareTask(sender: Employee, task: Task, receiverList: Employee[])
    {
        await this._mailThrottleService.checkThrottle(sender.user.id);

        const receiverAddressList = receiverList.map(employee => ({
            name: `${employee.firstName} ${employee.lastName}`,
            address: employee.user.email,
        }));

        // BINGO: generate URL for sharing task
        const url = new URL(appConfig().application.urlFront);
        url.searchParams.append(MAIL_QUERY_TYPE.ACTION, MAIL_ACTION_TYPE.SHARE_TASK);
        url.searchParams.append(MAIL_QUERY_TYPE.TASK_ID, task.id.toString());

        try
        {
            await this._mailerService.sendMail({
                to: receiverAddressList,
                subject: `${sender.firstName} ${sender.lastName} has shared a task with you`,
                template: './share-task',
                context: {
                    firstName: sender.firstName,
                    lastName: sender.lastName,
                    taskName: task.name,
                    taskDescription: task.description,
                    taskUrl: url.toString(),
                },
            });
        }
        catch (error)
        {
            throw new HttpException(error.response, error.responseCode);
        }

        await this._mailThrottleService.setThrottle(sender.user.id);
    }
}
