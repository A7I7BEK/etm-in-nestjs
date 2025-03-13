import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ShareTaskDto } from './dto/share-task.dto';
import { SharePermissions } from './enum/share-permissions.enum';
import { ShareService } from './share.service';


@ApiBearerAuth()
@ApiTags('share')
@Controller('share')
export class ShareController
{
    constructor (private readonly _service: ShareService) { }


    @Post('task/email')
    @Permission(SharePermissions.SHARE_TASK_EMAIL)
    async shareTaskEmail
        (
            @Body() dto: ShareTaskDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.shareTaskEmail(dto, activeUser);
    }


    @Post('task/telegram')
    @Permission(SharePermissions.SHARE_TASK_TELEGRAM)
    async shareTaskTelegram
        (
            @Body() dto: ShareTaskDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return 'TODO: Telegram needs to be implemented';
    }
}
