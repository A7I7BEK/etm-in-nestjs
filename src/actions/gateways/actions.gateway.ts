import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/common/config/app.config';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { Action } from '../entities/action.entity';
import { WS_ACTION_EMIT, WS_ACTION_PATH } from './action-gateway.constant';


@WebSocketGateway({
    path: WS_ACTION_PATH,
    cors: {
        origin: (req, callback) =>
        {
            const isDevelopment = appConfig().application.nodeEnv === appConfig().application.nodeEnvDev;
            callback(null, true); // `true` is temporary, must be `isDevelopment`
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
        this.server.to(this.roomPrefix + roomId).emit(WS_ACTION_EMIT.INSERT, payload);
    }
}
