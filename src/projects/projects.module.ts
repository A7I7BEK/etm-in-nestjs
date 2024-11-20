import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { GroupsModule } from 'src/groups/groups.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ResourceModule } from 'src/resource/resource.module';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Project ]),
        OrganizationsModule,
        GroupsModule,
        EmployeesModule,
        ResourceModule,
    ],
    exports: [ ProjectsService ],
    controllers: [ ProjectsController ],
    providers: [ ProjectsService ],
})
export class ProjectsModule { }
