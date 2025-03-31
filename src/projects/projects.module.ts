import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsModule } from 'src/actions/actions.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { GroupsModule } from 'src/groups/groups.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ProjectColumnsModule } from 'src/project-columns/project-columns.module';
import { ProjectMembersModule } from 'src/project-members/project-members.module';
import { ProjectTagsModule } from 'src/project-tags/project-tags.module';
import { ResourceModule } from 'src/resource/resource.module';
import { ProjectEntitySubscriber } from './entities/project-entity.subscriber';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Project ]),
        OrganizationsModule,
        EmployeesModule,
        GroupsModule,
        forwardRef(() => ProjectColumnsModule), // BINGO: Circular dependency problem solved
        forwardRef(() => ProjectMembersModule), // BINGO: Circular dependency problem solved
        forwardRef(() => ProjectTagsModule), // BINGO: Circular dependency problem solved
        ResourceModule,
        ActionsModule,
    ],
    exports: [ ProjectsService ],
    controllers: [ ProjectsController ],
    providers: [
        ProjectsService,
        ProjectEntitySubscriber,
    ],
})
export class ProjectsModule { }
