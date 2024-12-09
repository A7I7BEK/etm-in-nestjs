import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { CheckListGroup } from './entities/check-list-group.entity';
import { CheckListGroupsController } from './check-list-groups.controller';
import { CheckListGroupsService } from './check-list-groups.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ CheckListGroup ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ CheckListGroupsService ],
    controllers: [ CheckListGroupsController ],
    providers: [ CheckListGroupsService ],
})
export class CheckListGroupsModule { }
