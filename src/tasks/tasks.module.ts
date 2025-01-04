import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectColumnsModule } from 'src/project-columns/project-columns.module';
import { SocketModule } from 'src/socket/socket.module';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Task ]),
        ProjectColumnsModule,
        SocketModule,
    ],
    exports: [ TasksService ],
    controllers: [ TasksController ],
    providers: [ TasksService ],
})
export class TasksModule { }
