import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { TaskComment } from './entities/task-comment.entity';
import { TaskCommentsController } from './task-comments.controller';
import { TaskCommentsService } from './task-comments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskComment ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ TaskCommentsService ],
    controllers: [ TaskCommentsController ],
    providers: [ TaskCommentsService ],
})
export class TaskCommentsModule { }
