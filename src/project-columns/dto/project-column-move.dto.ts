import { IsInt, Min } from 'class-validator';

export class ProjectColumnMoveDto
{
    @Min(1)
    @IsInt()
    id: number;

    @Min(1)
    @IsInt()
    projectId: number;

    @Min(0)
    @IsInt()
    ordering: number;
}
