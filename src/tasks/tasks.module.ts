import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectColumnsModule } from 'src/project-columns/project-columns.module';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TasksService } from './tasks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Task ]),
        ProjectColumnsModule,
    ],
    exports: [ TasksService ],
    controllers: [ TasksController ],
    providers: [
        TasksService,
        TasksGateway,
    ],
})
export class TasksModule { }
