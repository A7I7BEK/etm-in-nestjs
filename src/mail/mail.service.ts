import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import appConfig from 'src/common/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { Task } from 'src/tasks/entities/task.entity';
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
        url.searchParams.append('action', 'confirmEmail');
        url.searchParams.append('token', token);

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


    async sendOtpCode(sender: Employee, code: string)
    {
        await this._mailThrottleService.checkThrottle(sender.user.id);

        try
        {
            await this._mailerService.sendMail({
                to: {
                    name: `${sender.firstName} ${sender.lastName}`,
                    address: sender.user.email,
                },
                subject: `${code} is your ${appConfig().application.name} verification code`,
                template: './confirm-email-via-code',
                context: {
                    firstName: sender.firstName,
                    lastName: sender.lastName,
                    code,
                },
            });
        }
        catch (error)
        {
            throw new HttpException(error.response, error.responseCode);
        }

        await this._mailThrottleService.setThrottle(sender.user.id);
    }


    async shareTask(sender: Employee, task: Task, receiverList: Employee[])
    {
        await this._mailThrottleService.checkThrottle(sender.user.id);

        const receiverAddressList = receiverList.map(employee => ({
            name: `${employee.firstName} ${employee.lastName}`,
            address: employee.user.email,
        }));

        // BINGO: generate URL for sharing task
        const url = new URL(appConfig().application.urlFront); // TODO: check if it is correct
        url.searchParams.append('action', 'taskShare');
        url.searchParams.append('taskId', task.id.toString());

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
