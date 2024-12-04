import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { TaskMember } from './entities/task-member.entity';
import { TaskMembersController } from './task-members.controller';
import { TaskMembersService } from './task-members.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskMember ]),
        forwardRef(() => TasksModule),
        EmployeesModule,
    ],
    exports: [ TaskMembersService ],
    controllers: [ TaskMembersController ],
    providers: [ TaskMembersService ],
})
export class TaskMembersModule { }
