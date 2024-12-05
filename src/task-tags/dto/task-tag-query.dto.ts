import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { TaskTagProperties } from '../enums/task-tag-properties.enum';

export class TaskTagQueryDto extends BaseQueryDto<TaskTagProperties>
{
    @IsOptional()
    @IsEnum(TaskTagProperties)
    sortBy?: TaskTagProperties = TaskTagProperties.ID;

    @Min(1)
    @IsInt()
    @Type(() => Number)
    taskId: number;
}