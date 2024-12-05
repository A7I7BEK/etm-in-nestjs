import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { TaskCommentProperties } from '../enums/task-comment-properties.enum';

export class TaskCommentQueryDto extends BaseQueryDto<TaskCommentProperties>
{
    @IsOptional()
    @IsEnum(TaskCommentProperties)
    sortBy?: TaskCommentProperties = TaskCommentProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}