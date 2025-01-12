import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { Task } from './entities/task.entity';


@WebSocketGateway({
    path: '/ws-tasks',
    cors: {
        origin: (req, callback) =>
        {
            const isProduction = appConfig().application.nodeEnv === appConfig().application.nodeEnvProd;
            callback(null, isProduction ? false : true);
        }
    },
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
        this.logger.log(`Server Initialized in: "${server._opts.path}"`);
    }

    handleConnection(client: Socket)
    {
        const roomId = client.handshake.query.roomId as string;
        client.join(this.roomName + roomId);

        this.logger.log(`Client Connected: ${client.data.user}`);
    }

    handleDisconnect(client: Socket)
    {
        this.logger.log(`Client Disconnected: ${client.data.user}`);
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
