import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceModule } from 'src/resource/resource.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskAttachment } from './entities/task-attachment.entity';
import { TaskAttachmentsController } from './task-attachments.controller';
import { TaskAttachmentsService } from './task-attachments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskAttachment ]),
        TasksModule,
        ResourceModule,
    ],
    exports: [ TaskAttachmentsService ],
    controllers: [ TaskAttachmentsController ],
    providers: [ TaskAttachmentsService ],
})
export class TaskAttachmentsModule { }
