import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { NotificationsController } from './notifications.controller';
import { NotificationsListener } from './notifications.listener';
import { NotificationsService } from './notifications.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([ Notification ]),
        TasksModule,
    ],
    exports: [ NotificationsService ],
    controllers: [ NotificationsController ],
    providers: [
        NotificationsService,
        NotificationsListener,
        NotificationsGateway,
    ],
})
export class NotificationsModule { }
