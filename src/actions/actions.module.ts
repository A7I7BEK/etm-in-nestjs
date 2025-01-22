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
        ProjectListener,
        ProjectColumnListener,
        ProjectMemberListener,
        ProjectTagListener,
    ],
})
export class ActionsModule { }
