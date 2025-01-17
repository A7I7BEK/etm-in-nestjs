import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Action } from './entities/action.entity';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Action ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ ActionsService ],
    controllers: [ ActionsController ],
    providers: [ ActionsService ],
})
export class ActionsModule { }
