import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { NotificationProperties } from '../enums/notification-properties.enum';

export class NotificationQueryDto extends BaseQueryDto<NotificationProperties>
{
    @IsOptional()
    @IsEnum(NotificationProperties)
    sortBy?: NotificationProperties = NotificationProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}