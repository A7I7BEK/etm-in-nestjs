import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from './entities/task.entity';

@WebSocketGateway({
    path: '/ws-tasks',
    cors: { origin: '*' },
})
@Injectable()
export class TasksGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private logger: Logger = new Logger('TasksGateway');

    @WebSocketServer()
    server: Server;

    roomName: 'project-';


    afterInit(server: Server)
    {
        this.logger.log(`Server Initialized in: ${server._opts.path}`);
    }

    handleConnection(client: Socket)
    {
        const roomId = client.handshake.query.roomId as string;
        client.join(this.roomName + roomId);

        this.logger.log(`Client Connected: ${client.id}`);
        console.log('Connected: ', client.handshake);
    }

    handleDisconnect(client: Socket)
    {
        this.logger.log(`Client Disconnected: ${client.id}`);
    }


    emitInsert(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomName + roomId).emit('task-insert', payload);
    }

    emitDelete(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomName + roomId).emit('task-delete', payload);
    }

    emitReplace(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomName + roomId).emit('task-replace', payload);
    }

    emitReorder(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomName + roomId).emit('task-reorder', payload);
    }

    emitMove(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomName + roomId).emit('task-move', payload);
    }
}
