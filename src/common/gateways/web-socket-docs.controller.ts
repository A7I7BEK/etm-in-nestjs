import { applyDecorators, Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Action } from 'src/actions/entities/action.entity';
import { WS_ACTION_EMIT, WS_ACTION_PATH } from 'src/actions/gateways/action-gateway.constant';
import { Notification } from 'src/notifications/entities/notification.entity';
import { WS_NOTIFICATION_EMIT, WS_NOTIFICATION_PATH } from 'src/notifications/gateways/notification-gateway.constant';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { WS_COLUMN_EMIT, WS_COLUMN_PATH } from 'src/project-columns/gateways/project-column-gateway.constant';
import { Task } from 'src/tasks/entities/task.entity';
import { WS_TASK_EMIT, WS_TASK_PATH } from 'src/tasks/gateways/task-gateway.constant';
import { User } from 'src/users/entities/user.entity';
import { WS_ACTIVE_USER_EMIT, WS_ACTIVE_USER_PATH } from 'src/users/gateways/active-user-gateway.constant';


const TaskEmitHTML = Object.values(WS_TASK_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');
const ColumnEmitHTML = Object.values(WS_COLUMN_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');
const ActionEmitHTML = Object.values(WS_ACTION_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');
const NotificationEmitHTML = Object.values(WS_NOTIFICATION_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');
const ActiveUserEmitHTML = Object.values(WS_ACTIVE_USER_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');


/**
 * BINGO: Websocket can be shown in Swagger UI
 * - This controller shows events from all WebSockets (aka Gateways)
 * - HTML is used to show the events in a list
 */
@ApiBearerAuth()
@ApiTags('WebSocket Documentation')
@Controller()
export class WebSocketDocsController
{
    @Get(WS_TASK_PATH)
    @ApiOperation({
        description: `Available events: <ol>${TaskEmitHTML}</ol>`,
    })
    @ApplyTokenDecorator()
    @ApplyRoomIdDecorator()
    getTask()
    {
        return new Task;
    }


    @Get(WS_COLUMN_PATH)
    @ApiOperation({
        description: `Available events: <ol>${ColumnEmitHTML}</ol>`,
    })
    @ApplyTokenDecorator()
    @ApplyRoomIdDecorator()
    getColumn()
    {
        return new ProjectColumn;
    }


    @Get(WS_ACTION_PATH)
    @ApiOperation({
        description: `Available events: <ol>${ActionEmitHTML}</ol>`,
    })
    @ApplyTokenDecorator()
    @ApplyRoomIdDecorator()
    getAction()
    {
        return new Action;
    }


    @Get(WS_NOTIFICATION_PATH)
    @ApiOperation({
        description: `Available events: <ol>${NotificationEmitHTML}</ol>`,
    })
    @ApplyTokenDecorator()
    getNotification()
    {
        return new Notification;
    }


    @Get(WS_ACTIVE_USER_PATH)
    @ApiOperation({
        description: `Available events: <ol>${ActiveUserEmitHTML}</ol>`,
    })
    @ApplyTokenDecorator()
    getActiveUser()
    {
        return new User;
    }
}


function ApplyRoomIdDecorator()
{
    return applyDecorators(
        ApiQuery({
            name: 'roomId',
            type: 'integer',
            example: 10,
            description: 'roomId === projectId',
            required: true,
        })
    );
}


function ApplyTokenDecorator()
{
    return applyDecorators(
        ApiQuery({
            name: 'token',
            type: 'string',
            example: 'token',
            required: true,
            description: `Send <b>access token</b> using auth object in socket.io client.
            <br><br>
            Example: <code>socket = io('http://localhost:3000',
            { auth: { token: 'access token' } })</code>
            <br><br>`,
        })
    );
}