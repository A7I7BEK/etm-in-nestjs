import { Injectable, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { Action } from './entities/action.entity';


@ApiTags('ws-actions')
@WebSocketGateway({
    path: '/ws-actions',
    cors: {
        origin: (req, callback) =>
        {
            const isDevelopment = appConfig().application.nodeEnv === appConfig().application.nodeEnvDev;
            callback(null, isDevelopment);
        }
    },
})
@Injectable()
export class ActionsGateway extends BaseGateway
{
    @WebSocketServer()
    server: Server;

    roomPrefix = 'project-';


    constructor (jwtService: JwtCustomService)
    {
        super(new Logger(ActionsGateway.name), jwtService);
    }


    emitInsert(payload: Action, roomId: string | number)
    {
        this.server.to(this.roomPrefix + roomId).emit('action-insert', payload);
    }
}
