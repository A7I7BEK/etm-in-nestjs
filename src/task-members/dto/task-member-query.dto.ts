import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { TaskMemberProperties } from '../enums/task-member-properties.enum';

export class TaskMemberQueryDto extends BaseQueryDto<TaskMemberProperties>
{
    @IsOptional()
    @IsEnum(TaskMemberProperties)
    sortBy?: TaskMemberProperties = TaskMemberProperties.ID;

    @Min(1)
    @IsInt()
    @Type(() => Number)
    taskId: number;
}