import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ProjectBackgroundDto
{
    @IsNotEmpty()
    @IsString()
    background: string;

    @Min(1)
    @IsInt()
    projectId: number;
}
