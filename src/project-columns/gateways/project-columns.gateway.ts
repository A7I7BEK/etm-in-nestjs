import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { ProjectColumn } from '../entities/project-column.entity';
import { WS_COLUMN_EMIT, WS_COLUMN_PATH } from './project-column-gateway.constant';


@WebSocketGateway({
    path: WS_COLUMN_PATH,
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
        this.server.to(this.roomPrefix + roomId).emit(WS_COLUMN_EMIT.INSERT, payload);
    }

    emitDelete(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_COLUMN_EMIT.DELETE, payload);
    }

    emitReplace(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_COLUMN_EMIT.REPLACE, payload);
    }

    emitReorder(payload: ProjectColumn, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit(WS_COLUMN_EMIT.REORDER, payload);
    }
}
