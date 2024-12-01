import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { TaskProperties } from '../enums/task-properties.enum';

export class TaskQueryDto extends BaseQueryDto<TaskProperties>
{
    @IsOptional()
    @IsEnum(TaskProperties)
    sortBy?: TaskProperties = TaskProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}