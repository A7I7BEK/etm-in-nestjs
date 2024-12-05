import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class TaskCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @Min(1)
    @IsInt()
    projectId: number;

    @Min(1)
    @IsInt()
    columnId: number;
}