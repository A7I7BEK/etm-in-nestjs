import { IsInt, Min } from 'class-validator';

export class TaskMemberCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @Min(1)
    @IsInt()
    projectMemberId: number;
}
