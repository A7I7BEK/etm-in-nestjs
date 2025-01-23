import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';
import { ProjectColumnListener } from './listener/project-column.listener';
import { ProjectMemberListener } from './listener/project-member.listener';
import { ProjectTagListener } from './listener/project-tag.listener';
import { ProjectListener } from './listener/project.listener';
import { TaskCommentListener } from './listener/task-comment.listener';
import { TaskDeadlineListener } from './listener/task-deadline.listener';
import { TaskMemberListener } from './listener/task-member.listener';
import { TaskTagListener } from './listener/task-tag.listener';
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
        TaskListener,
        TaskTagListener,
        TaskMemberListener,
        TaskCommentListener,
        TaskDeadlineListener,
        ProjectListener,
        ProjectTagListener,
        ProjectColumnListener,
        ProjectMemberListener,
    ],
})
export class ActionsModule { }
