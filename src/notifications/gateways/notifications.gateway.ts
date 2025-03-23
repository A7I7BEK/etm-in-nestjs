import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { AccessTokenData } from 'src/iam/jwt/interfaces/access-token-data.interface';
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
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;
    roomPrefix = 'user-';
    logger = new Logger(NotificationsGateway.name);


    constructor (
        private readonly _jwtService: JwtCustomService,
    ) { }


    afterInit(server: Server)
    {
        this.logger.log(`Server Initialized in: "${server._opts.path}"`);

        server.use(async (socket, next) =>
        {
            // const token = socket.handshake.headers.token as string; // for Postman
            const token = socket.handshake.auth.token as string; // for Frontend

            if (!token)
            {
                return next(new Error('"token" is required'));
            }

            try
            {
                const payload = await this._jwtService.verifyAccessToken(token);
                socket.data.user = payload;

                next();
            }
            catch (error)
            {
                next(new Error('Authentication error'));
            }
        });
    }


    async handleConnection(client: Socket)
    {
        const user: AccessTokenData = client.data.user;

        const roomName = this.roomPrefix + user.sub;
        client.join(roomName);
        client.data.room = roomName;

        this.logger.log(`Connected: { user: id-${user.sub} } && { room: ${roomName} }`);
    }


    handleDisconnect(client: Socket)
    {
        const { user, room }: { user: AccessTokenData, room: string; } = client.data;
        this.logger.log(`Disconnected: { user: id-${user.sub} } && { room: ${room} }`);
    }


    emitInsert(payload: Notification, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_NOTIFICATION_EMIT.INSERT, payload);
    }
}
