import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsModule } from 'src/actions/actions.module';
import { ProjectColumnsModule } from 'src/project-columns/project-columns.module';
import { TaskCommentsModule } from 'src/task-comments/task-comments.module';
import { Task } from './entities/task.entity';
import { TasksGateway } from './gateways/tasks.gateway';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Task ]),
        ProjectColumnsModule,
        forwardRef(() => TaskCommentsModule),
        ActionsModule,
    ],
    exports: [ TasksService ],
    controllers: [ TasksController ],
    providers: [
        TasksService,
        TasksGateway,
    ],
})
export class TasksModule { }
