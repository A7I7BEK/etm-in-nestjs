import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';


export abstract class BaseGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    abstract roomPrefix: string;


    constructor (
        private readonly logger: Logger,
        private readonly jwtService: JwtCustomService,
    ) { }


    afterInit(server: Server)
    {
        this.logger.log(`Server Initialized in: "${server._opts.path}"`);

        server.use(async (socket, next) =>
        {
            const token = socket.handshake.headers.token as string; // for Postman
            // const token = socket.handshake.auth.token as string; // for Frontend
            const roomId = socket.handshake.query.roomId as string;

            if (!token || !roomId)
            {
                return next(new Error('"token" and "roomId" are required'));
            }

            try
            {
                const payload = await this.jwtService.verifyAccessToken(token);
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
        const roomName = this.roomPrefix + client.handshake.query.roomId;
        client.join(roomName);
        client.data.room = roomName;

        this.logger.log(`Connected: { user: id-${client.data.user?.sub} } && { room: ${client.data.room} }`);
    }


    handleDisconnect(client: Socket)
    {
        this.logger.log(`Disconnected: { user: id-${client.data.user?.sub} } && { room: ${client.data.room} }`);
    }
}
