import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class TaskAttachmentQueryDto
{
    @Min(1)
    @IsInt()
    @Type(() => Number)
    taskId: number;
}
