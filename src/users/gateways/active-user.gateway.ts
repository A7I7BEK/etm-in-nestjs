import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { AccessTokenData } from 'src/iam/jwt/interfaces/access-token-data.interface';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from '../entities/user.entity';
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
    server: Server;
    roomPrefix = 'organization-';
    logger = new Logger(ActiveUsersGateway.name);


    constructor (
        private readonly _service: UsersService,
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
        const roomName = this.roomPrefix + user.orgId;
        client.join(roomName);
        client.data.room = roomName;

        await this.emitActiveUser(true, user);

        // this.logger.log(`Connected: { user: id-${user.sub} } && { room: ${roomName} }`);
    }


    async handleDisconnect(client: Socket)
    {
        const { user, room }: { user: AccessTokenData, room: string; } = client.data;

        await this.emitActiveUser(false, user);

        // this.logger.log(`Disconnected: { user: id-${user.sub} } && { room: ${room} }`);
    }


    private async emitActiveUser(isOnline: boolean, user: AccessTokenData)
    {
        const partialEntity: QueryDeepPartialEntity<User> = {
            isOnline,
            lastOnlineAt: new Date(),
        };

        await this._service.repository.update(user.sub, partialEntity);

        this.server
            .to(this.roomPrefix + user.orgId)
            .emit(WS_ACTIVE_USER_EMIT.JOIN, { ...partialEntity, userId: user.sub });
    }
}
