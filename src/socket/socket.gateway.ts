import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import appConfig from 'src/common/config/app.config';

@WebSocketGateway({
    path: '/web-socket',
    cors: { origin: '*' },
})
@Injectable()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor (
        private readonly jwtService: JwtService,
    ) { }


    private logger: Logger = new Logger('SocketGateway');

    @WebSocketServer()
    server: Server;


    afterInit(server: Server)
    {
        this.logger.log(`WebSocket server Initialized: ${server.engine.clientsCount}`);
        console.log('WebSocket server Initialized: ', server);
    }

    async handleConnection(client: Socket, ...args: any[])
    {
        console.log(`WebSocket client Connected Args: ${args}`);

        try
        {
            const token = client.handshake.auth.token as string;
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: appConfig().jwt.accessTokenSecret,
                    audience: appConfig().jwt.audience,
                    issuer: appConfig().jwt.issuer,
                }
            );

            this.logger.log(`WebSocket client Connected: ${client.id} (User ID: ${payload.sub})`);
        }
        catch (error)
        {
            this.logger.error('WebSocket invalid token, disconnecting...');
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket)
    {
        this.logger.log(`WebSocket client Disconnected: ${client.id}`);
    }


    emitTaskChange(payload: any)
    {
        this.server.emit('task-change', payload);
    }

    emitColumnChange(payload: any)
    {
        this.server.emit('column-change', payload);
    }

    emitNewNotification(payload: any)
    {
        this.server.emit('new-notification', payload);
    }

    emitNewAction(payload: any)
    {
        this.server.emit('new-action', payload);
    }
}
