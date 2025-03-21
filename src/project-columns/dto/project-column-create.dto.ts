import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ProjectColumnCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @Min(1)
    @IsInt()
    projectId: number;
}
