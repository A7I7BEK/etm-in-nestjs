import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Notification } from 'src/notifications/entities/notification.entity';
import { WS_NOTIFICATION_EMIT, WS_NOTIFICATION_PATH } from 'src/notifications/gateways/notification-gateway.constant';


const NotificationEmitHTML = Object.values(WS_NOTIFICATION_EMIT).map(val => `<li><h3>${val}</h3></li>`).join('');


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
}