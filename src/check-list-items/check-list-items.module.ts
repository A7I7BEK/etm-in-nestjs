import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { CheckListItem } from './entities/check-list-item.entity';
import { CheckListItemsController } from './check-list-items.controller';
import { CheckListItemsService } from './check-list-items.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ CheckListItem ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ CheckListItemsService ],
    controllers: [ CheckListItemsController ],
    providers: [ CheckListItemsService ],
})
export class CheckListItemsModule { }
