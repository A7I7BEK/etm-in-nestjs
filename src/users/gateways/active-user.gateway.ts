import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { RedisStorageService } from 'src/redis-storage/redis-storage.service';
import { Equal, In } from 'typeorm';
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
    constructor (
        private readonly _service: UsersService,
        private readonly _jwtService: JwtCustomService,
        private readonly _redisStorage: RedisStorageService,
    ) { }


    @WebSocketServer()
    private readonly server: Server;
    private readonly roomPrefix = 'organization-';
    private readonly logger = new Logger(ActiveUsersGateway.name);


    private keyName(orgId: number): string
    {
        return `ACTIVE_USERS:${this.roomPrefix}${orgId}`;
    }


    private async emitActiveUsers(orgId: number)
    {
        const activeUsers = await this._redisStorage.redisClient
            .smembers(this.keyName(orgId));

        const userEntityList = await this._service.repository.find({
            where: {
                id: In(activeUsers),
                organization: {
                    id: Equal(orgId),
                }
            },
        });

        this.server
            .to(this.roomPrefix + orgId)
            .emit(WS_ACTIVE_USER_EMIT.JOIN, userEntityList);
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
        const { user } = client.data;
        const roomName = this.roomPrefix + user.orgId;
        client.join(roomName);
        client.data.room = roomName;

        await this._service.repository.update(user.sub, {
            lastActiveAt: new Date(),
        });

        await this._redisStorage.redisClient
            .sadd(this.keyName(user.orgId), user.sub);

        await this.emitActiveUsers(user.orgId);

        this.logger.log(`Connected: { user: id-${user.sub} } && { room: ${roomName} }`);
    }


    async handleDisconnect(client: Socket)
    {
        const { user, room } = client.data;

        await this._service.repository.update(user.sub, {
            lastActiveAt: new Date(),
        });

        await this._redisStorage.redisClient
            .srem(this.keyName(user.orgId), user.sub);

        this.emitActiveUsers(user.orgId);

        this.logger.log(`Disconnected: { user: id-${user.sub} } && { room: ${room} }`);
    }
}
