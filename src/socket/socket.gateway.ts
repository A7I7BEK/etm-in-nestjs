import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private logger: Logger = new Logger('AppSocketGateway');

    @WebSocketServer()
    server: Server;


    afterInit(server: Server)
    {
        this.logger.log(`Server Initialized: ${server.engine.clientsCount}`);
    }

    handleConnection(client: Socket, ...args: any[])
    {
        this.logger.log(`Client Connected: ${client.id}`);
        this.logger.log(`Client Args: ${args}`);
    }

    handleDisconnect(client: Socket)
    {
        this.logger.log(`Client Disconnected: ${client.id}`);
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
