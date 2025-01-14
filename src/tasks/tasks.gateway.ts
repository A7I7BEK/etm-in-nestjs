import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
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
export class TasksGateway extends BaseGateway
{
    @WebSocketServer()
    server: Server;

    roomPrefix = 'project-';


    constructor (jwtService: JwtService)
    {
        super(new Logger('TasksGateway'), jwtService);
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
