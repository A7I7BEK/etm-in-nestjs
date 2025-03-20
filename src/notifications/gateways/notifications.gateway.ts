import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { Notification } from '../entities/notification.entity';
import { WS_NOTIFICATION_EMIT, WS_NOTIFICATION_PATH } from './notification-gateway.constant';


@WebSocketGateway({
    path: WS_NOTIFICATION_PATH,
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
        this.server.to(this.roomPrefix + roomId).emit(WS_NOTIFICATION_EMIT.INSERT, payload);
    }

    emitDeleteOne(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_NOTIFICATION_EMIT.DELETE_ONE, payload);
    }

    emitDeleteAll(payload: Notification[], roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_NOTIFICATION_EMIT.DELETE_ALL, payload);
    }

    emitReplaceOne(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_NOTIFICATION_EMIT.REPLACE_ONE, payload);
    }

    emitReplaceAll(payload: Notification[], roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_NOTIFICATION_EMIT.REPLACE_ALL, payload);
    }
}
