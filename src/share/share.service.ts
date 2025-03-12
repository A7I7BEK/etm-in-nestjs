import { Injectable } from '@nestjs/common';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { MailService } from 'src/mail/mail.service';
import { TasksService } from 'src/tasks/tasks.service';
import { ShareTaskDto } from './dto/share-task.dto';
import { ShareChannel } from './enum/share-channel.enum';
import { shareTaskPart } from './part/share-task.part';

@Injectable()
export class ShareService
{
    constructor (
        public readonly mailService: MailService,
        public readonly tasksService: TasksService,
        public readonly employeesService: EmployeesService,
    ) { }


    shareTaskEmail
        (
            dto: ShareTaskDto,
            activeUser: ActiveUserData,
        )
    {
        return shareTaskPart(this, dto, activeUser, ShareChannel.EMAIL);
    }
}
