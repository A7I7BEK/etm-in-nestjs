import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Notification ]),
        TasksModule,
    ],
    exports: [ NotificationsService ],
    controllers: [ NotificationsController ],
    providers: [ NotificationsService ],
})
export class NotificationsModule { }
