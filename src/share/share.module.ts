import { Module } from '@nestjs/common';
import { EmployeesModule } from 'src/employees/employees.module';
import { MailModule } from 'src/mail/mail.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';

@Module({
    imports: [
        MailModule,
        TasksModule,
        EmployeesModule,
    ],
    exports: [ ShareService ],
    controllers: [ ShareController ],
    providers: [ ShareService ],
})
export class ShareModule { }
