import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectColumn } from './entities/project-column.entity';
import { ProjectColumnsController } from './project-columns.controller';
import { ProjectColumnsService } from './project-columns.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ProjectColumn ]),
        OrganizationsModule,
        PermissionsModule,
        forwardRef(() => UsersModule), // BINGO
    ],
    exports: [ ProjectColumnsService ],
    controllers: [ ProjectColumnsController ],
    providers: [ ProjectColumnsService ],
})
export class ProjectColumnsModule { }
