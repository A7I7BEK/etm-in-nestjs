import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskTimer } from './entities/task-timer.entity';
import { TaskTimerController } from './task-timer.controller';
import { TaskTimerService } from './task-timer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskTimer ]),
        TasksModule,
        EmployeesModule,
    ],
    exports: [ TaskTimerService ],
    controllers: [ TaskTimerController ],
    providers: [ TaskTimerService ],
})
export class TaskTimerModule { }
