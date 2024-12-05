import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { TaskTag } from './entities/task-tag.entity';
import { TaskTagsController } from './task-tags.controller';
import { TaskTagsService } from './task-tags.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskTag ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ TaskTagsService ],
    controllers: [ TaskTagsController ],
    providers: [ TaskTagsService ],
})
export class TaskTagsModule { }
