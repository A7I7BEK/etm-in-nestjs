import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskComment } from './entities/task-comment.entity';
import { TaskCommentsController } from './task-comments.controller';
import { TaskCommentsService } from './task-comments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskComment ]),
        forwardRef(() => TasksModule),
        EmployeesModule,
    ],
    exports: [ TaskCommentsService ],
    controllers: [ TaskCommentsController ],
    providers: [ TaskCommentsService ],
})
export class TaskCommentsModule { }
