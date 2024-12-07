import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskDeadline } from './entities/task-deadline.entity';
import { TaskDeadlineController } from './task-deadline.controller';
import { TaskDeadlineService } from './task-deadline.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskDeadline ]),
        TasksModule,
    ],
    exports: [ TaskDeadlineService ],
    controllers: [ TaskDeadlineController ],
    providers: [ TaskDeadlineService ],
})
export class TaskDeadlineModule { }
