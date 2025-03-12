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


    async sendOtpCodeEmail(userId: number, email: string, code: string)
    {
        await this._mailThrottleService.checkThrottle(userId);

        try
        {
            await this._mailerService.sendMail({
                to: email,
                subject: `${code} is your ${appConfig().application.name} verification code`,
                template: './confirm-email-simple',
                context: {
                    code,
                },
            });
        }
        catch (error)
        {
            throw new HttpException(error.response, error.responseCode);
        }

        await this._mailThrottleService.setThrottle(userId);
    }


    async sendOtpCodeUser(sender: Employee, code: string)
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
                template: './confirm-email-user',
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
                    taskUrl: appConfig().application.urlFront + '?taskShare=' + task.id,
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
