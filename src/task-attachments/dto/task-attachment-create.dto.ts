import { IsInt, Min } from 'class-validator';

export class TaskAttachmentCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @Min(1)
    @IsInt()
    fileId: number;
}
