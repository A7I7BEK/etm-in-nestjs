import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { Task } from './entities/task.entity';


@WebSocketGateway({
    path: '/ws-tasks',
    cors: {
        origin: (req, callback) =>
        {
            const isDevelopment = appConfig().application.nodeEnv === appConfig().application.nodeEnvDev;
            callback(null, isDevelopment); // TODO: check if this is correct
        }
    },
})
@Injectable()
export class TasksGateway extends BaseGateway
{
    @WebSocketServer()
    server: Server;

    roomPrefix = 'project-';


    constructor (jwtService: JwtCustomService)
    {
        super(new Logger(TasksGateway.name), jwtService);
    }


    emitInsert(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('task-insert', payload);
    }

    emitDelete(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('task-delete', payload);
    }

    emitReplace(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('task-replace', payload);
    }

    emitReorder(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('task-reorder', payload);
    }

    emitMove(payload: Task, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('task-move', payload);
    }
}
