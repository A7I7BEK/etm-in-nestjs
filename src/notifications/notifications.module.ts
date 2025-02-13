import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Notification ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ NotificationsService ],
    controllers: [ NotificationsController ],
    providers: [ NotificationsService ],
})
export class NotificationsModule { }
