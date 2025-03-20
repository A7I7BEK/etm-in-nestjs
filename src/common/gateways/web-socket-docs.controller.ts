import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Notification } from 'src/notifications/entities/notification.entity';
import { WS_NOTIFICATION_EMIT, WS_NOTIFICATION_PATH } from 'src/notifications/gateways/notification-gateway.constant';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { WS_COLUMN_EMIT, WS_COLUMN_PATH } from 'src/project-columns/gateways/project-column-gateway.constant';
import { Task } from 'src/tasks/entities/task.entity';
import { WS_TASK_EMIT, WS_TASK_PATH } from 'src/tasks/gateways/task-gateway.constant';


const NotificationEmitHTML = Object.values(WS_NOTIFICATION_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');
const TaskEmitHTML = Object.values(WS_TASK_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');
const ColumnEmitHTML = Object.values(WS_COLUMN_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');


/**
 * BINGO: Websocket can be shown in Swagger UI
 * - This controller shows events from all WebSockets (aka Gateways)
 * - HTML is used to show the events in a list
 */
@ApiTags('WebSocket Documentation')
@Controller()
export class WebSocketDocsController
{
    @Get(WS_NOTIFICATION_PATH)
    @ApiOperation({
        description: `Available events: <ol>${NotificationEmitHTML}</ol>`,
    })
    getNotification()
    {
        return new Notification;
    }


    @Get(WS_TASK_PATH)
    @ApiOperation({
        description: `Available events: <ol>${TaskEmitHTML}</ol>`,
    })
    getTask()
    {
        return new Task;
    }


    @Get(WS_COLUMN_PATH)
    @ApiOperation({
        description: `Available events: <ol>${ColumnEmitHTML}</ol>`,
    })
    getColumn()
    {
        return new ProjectColumn;
    }
}