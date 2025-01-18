import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { ActionProperties } from '../enums/action-properties.enum';

export class ActionQueryDto extends BaseQueryDto<ActionProperties>
{
    @IsOptional()
    @IsEnum(ActionProperties)
    sortBy?: ActionProperties = ActionProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    projectId?: number;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    taskId?: number;
}