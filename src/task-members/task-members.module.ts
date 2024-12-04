import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { TaskMember } from './entities/task-member.entity';
import { TaskMembersController } from './task-members.controller';
import { TaskMembersService } from './task-members.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskMember ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ TaskMembersService ],
    controllers: [ TaskMembersController ],
    providers: [ TaskMembersService ],
})
export class TaskMembersModule { }
