import { IsInt, Min } from 'class-validator';

export class TaskMoveDto
{
    @Min(1)
    @IsInt()
    id: number;

    @Min(1)
    @IsInt()
    projectId: number;

    @Min(1)
    @IsInt()
    columnId: number;

    @Min(0)
    @IsInt()
    ordering: number;
}
