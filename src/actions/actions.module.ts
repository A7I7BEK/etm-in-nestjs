import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { ActionsController } from './actions.controller';
import { ActionsGateway } from './actions.gateway';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';
import { CheckListGroupListener } from './listener/check-list-group.listener';
import { CheckListItemListener } from './listener/check-list-item.listener';
import { ProjectColumnListener } from './listener/project-column.listener';
import { ProjectMemberListener } from './listener/project-member.listener';
import { ProjectTagListener } from './listener/project-tag.listener';
import { ProjectListener } from './listener/project.listener';
import { TaskAttachmentListener } from './listener/task-attachment.listener';
import { TaskCommentListener } from './listener/task-comment.listener';
import { TaskDeadlineListener } from './listener/task-deadline.listener';
import { TaskMemberListener } from './listener/task-member.listener';
import { TaskTagListener } from './listener/task-tag.listener';
import { TaskTimerListener } from './listener/task-timer.listener';
import { TaskListener } from './listener/task.listener';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Action ]),
        EmployeesModule,
    ],
    exports: [ ActionsService ],
    controllers: [ ActionsController ],
    providers: [
        ActionsService,
        ActionsGateway,
        TaskListener,
        TaskTagListener,
        TaskTimerListener,
        TaskMemberListener,
        TaskCommentListener,
        TaskDeadlineListener,
        TaskAttachmentListener,
        ProjectListener,
        ProjectTagListener,
        ProjectColumnListener,
        ProjectMemberListener,
        CheckListGroupListener,
        CheckListItemListener,
    ],
})
export class ActionsModule { }
