import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { AccessTokenData } from 'src/iam/jwt/interfaces/access-token-data.interface';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { UsersService } from '../users.service';
import { WS_ACTIVE_USER_EMIT, WS_ACTIVE_USER_PATH } from './active-user-gateway.constant';


@WebSocketGateway({
    path: WS_ACTIVE_USER_PATH,
    cors: {
        origin: (req, callback) =>
        {
            const isDevelopment = appConfig().application.nodeEnv === appConfig().application.nodeEnvDev;
            callback(null, isDevelopment);
        }
    },
})
@Injectable()
export class ActiveUsersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    private readonly server: Server;
    private readonly roomPrefix = 'organization-';
    private readonly logger = new Logger(ActiveUsersGateway.name);


    constructor (
        private readonly _service: UsersService,
        private readonly _jwtService: JwtCustomService,
    ) { }


    private emitActiveUser(payload: any, roomId: string | number)
    {
        this.server
            .to(this.roomPrefix + roomId)
            .emit(WS_ACTIVE_USER_EMIT.JOIN, payload);
    }


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
        const roomName = this.roomPrefix + user.orgId;
        client.join(roomName);
        client.data.room = roomName;

        const aaaaaaaaaaa = await this._service.repository.update(user.sub, {
            isOnline: true,
            lastOnlineAt: new Date(),
        });
        console.log('aaaaaaaaaaa', aaaaaaaaaaa);
        this.emitActiveUser(aaaaaaaaaaa, user.orgId);

        this.logger.log(`Connected: { user: id-${user.sub} } && { room: ${roomName} }`);
    }


    async handleDisconnect(client: Socket)
    {
        const { user, room }: { user: AccessTokenData, room: string; } = client.data;

        const bbbbbbbbb = await this._service.repository.update(user.sub, {
            isOnline: false,
            lastOnlineAt: new Date(),
        });
        console.log('bbbbbbbbb', bbbbbbbbb);
        this.emitActiveUser(bbbbbbbbb, user.orgId);

        this.logger.log(`Disconnected: { user: id-${user.sub} } && { room: ${room} }`);
    }
}
