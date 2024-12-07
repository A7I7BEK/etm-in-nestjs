import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class TaskCopyDto
{
    @Min(1)
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

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
