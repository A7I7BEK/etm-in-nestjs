import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTagsModule } from 'src/project-tags/project-tags.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskTag } from './entities/task-tag.entity';
import { TaskTagsController } from './task-tags.controller';
import { TaskTagsService } from './task-tags.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskTag ]),
        forwardRef(() => TasksModule),
        ProjectTagsModule,
    ],
    exports: [ TaskTagsService ],
    controllers: [ TaskTagsController ],
    providers: [ TaskTagsService ],
})
export class TaskTagsModule { }
