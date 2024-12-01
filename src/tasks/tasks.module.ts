import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Task ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ TasksService ],
    controllers: [ TasksController ],
    providers: [ TasksService ],
})
export class TasksModule { }
