import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { NotificationProperties } from '../enums/notification-properties.enum';

export class NotificationQueryDto extends BaseQueryDto<NotificationProperties>
{
    @IsOptional()
    @IsEnum(NotificationProperties)
    sortBy?: NotificationProperties = NotificationProperties.ID;
}