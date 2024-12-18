import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { TaskTimerProperties } from '../enums/task-timer-properties.enum';

export class TaskTimerQueryDto extends BaseQueryDto<TaskTimerProperties>
{
    @IsOptional()
    @IsEnum(TaskTimerProperties)
    sortBy?: TaskTimerProperties = TaskTimerProperties.ID;

    @Min(1)
    @IsInt()
    @Type(() => Number)
    taskId: number;
}