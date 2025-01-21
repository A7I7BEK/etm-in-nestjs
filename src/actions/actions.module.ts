import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';
import { ColumnListener } from './listener/column.listener';
import { ProjectListener } from './listener/project.listener';
import { TaskListener } from './listener/task.listener';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Action ]),
        EmployeesModule,
        TasksModule,
    ],
    exports: [ ActionsService ],
    controllers: [ ActionsController ],
    providers: [
        ActionsService,
        TaskListener,
        ColumnListener,
        ProjectListener,
    ],
})
export class ActionsModule { }
