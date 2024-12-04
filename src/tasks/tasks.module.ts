import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectColumnsModule } from 'src/project-columns/project-columns.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Task ]),
        ProjectsModule,
        ProjectColumnsModule,
    ],
    exports: [ TasksService ],
    controllers: [ TasksController ],
    providers: [ TasksService ],
})
export class TasksModule { }
