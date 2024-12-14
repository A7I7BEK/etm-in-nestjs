import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { TaskAttachmentProperties } from '../enums/task-attachment-properties.enum';

export class TaskAttachmentQueryDto extends BaseQueryDto<TaskAttachmentProperties>
{
    @IsOptional()
    @IsEnum(TaskAttachmentProperties)
    sortBy?: TaskAttachmentProperties = TaskAttachmentProperties.ID;

    @Min(1)
    @IsInt()
    @Type(() => Number)
    taskId: number;
}