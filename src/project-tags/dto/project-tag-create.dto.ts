import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ProjectTagCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    color: string;

    @Min(1)
    @IsInt()
    projectId: number;
}
