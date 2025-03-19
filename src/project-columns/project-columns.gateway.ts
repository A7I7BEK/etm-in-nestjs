import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
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


    constructor (jwtService: JwtCustomService)
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
}
