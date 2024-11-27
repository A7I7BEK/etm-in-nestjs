import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectMembersController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ProjectMember ]),
        forwardRef(() => ProjectsModule), // BINGO
        EmployeesModule,
    ],
    exports: [ ProjectMembersService ],
    controllers: [ ProjectMembersController ],
    providers: [ ProjectMembersService ],
})
export class ProjectMembersModule { }
