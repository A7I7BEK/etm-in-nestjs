import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';


export abstract class BaseGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    abstract roomPrefix: string;


    constructor (
        private readonly logger: Logger,
        private readonly jwtService: JwtService,
    ) { }


    afterInit(server: Server)
    {
        this.logger.log(`Server Initialized in: "${server._opts.path}"`);

        server.use(async (socket, next) =>
        {
            const token = socket.handshake.headers.token as string;
            const roomId = socket.handshake.query.roomId as string;

            if (!token || !roomId)
            {
                return next(new Error('"token" and "roomId" are required'));
            }

            try
            {
                const payload: ActiveUserData = await this.jwtService.verifyAsync(token);
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


        const { sub } = client.data.user || {};
        this.logger.log(`Connected: { user: id-${sub} } && { room: ${client.data.room} }`);
    }


    handleDisconnect(client: Socket)
    {
        const { sub } = client.data.user || {};
        this.logger.log(`Disconnected: { user: id-${sub} } && { room: ${client.data.room} }`);
    }
}
