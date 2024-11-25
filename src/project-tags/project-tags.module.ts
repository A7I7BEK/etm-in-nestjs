import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectTag } from './entities/project-tag.entity';
import { ProjectTagsController } from './project-tags.controller';
import { ProjectTagsService } from './project-tags.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ProjectTag ]),
        OrganizationsModule,
        PermissionsModule,
        forwardRef(() => UsersModule), // BINGO
    ],
    exports: [ ProjectTagsService ],
    controllers: [ ProjectTagsController ],
    providers: [ ProjectTagsService ],
})
export class ProjectTagsModule { }
