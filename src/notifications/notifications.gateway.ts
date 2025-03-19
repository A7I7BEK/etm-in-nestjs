import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { Notification } from './entities/notification.entity';


@WebSocketGateway({
    path: '/ws-notification',
    cors: {
        origin: (req, callback) =>
        {
            const isDevelopment = appConfig().application.nodeEnv === appConfig().application.nodeEnvDev;
            callback(null, isDevelopment);
        }
    },
})
@Injectable()
export class NotificationsGateway extends BaseGateway
{
    @WebSocketServer()
    server: Server;

    roomPrefix = 'user-';


    constructor (jwtService: JwtCustomService)
    {
        super(new Logger(NotificationsGateway.name), jwtService);
    }


    emitInsert(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('notification-insert', payload);
    }

    emitDeleteOne(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('notification-delete-one', payload);
    }

    emitDeleteAll(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('notification-delete-all', payload);
    }

    emitReplaceOne(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('notification-replace-one', payload);
    }

    emitReplaceAll(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('notification-replace-all', payload);
    }
}
