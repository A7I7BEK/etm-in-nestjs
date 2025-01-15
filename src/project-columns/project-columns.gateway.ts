import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { ProjectColumn } from './entities/project-column.entity';


@WebSocketGateway({
    path: '/ws-project-columns',
    cors: {
        origin: (req, callback) =>
        {
            const isDevelopment = appConfig().application.nodeEnv === appConfig().application.nodeEnvDev;
            callback(null, isDevelopment);
        }
    },
})
@Injectable()
export class ProjectColumnsGateway extends BaseGateway
{
    @WebSocketServer()
    server: Server;

    roomPrefix = 'project-';


    constructor (jwtService: JwtService)
    {
        super(new Logger(ProjectColumnsGateway.name), jwtService);
    }


    emitInsert(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('column-insert', payload);
    }

    emitDelete(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('column-delete', payload);
    }

    emitReplace(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('column-replace', payload);
    }

    emitReorder(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('column-reorder', payload);
    }

    emitMove(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('column-move', payload);
    }
}
