import { IsInt, Min } from 'class-validator';

export class TaskTagCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @Min(1)
    @IsInt()
    projectTagId: number;
}
