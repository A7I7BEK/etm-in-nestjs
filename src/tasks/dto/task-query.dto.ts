import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
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
    columnId?: number;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    projectId?: number;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    ownTask?: boolean;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    deadLine?: Date;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    hasNoDeadline?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    inNextDay?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    inNextWeek?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    inNextMonth?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    overdue?: boolean;
}