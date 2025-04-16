import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ProjectBackgroundDto
{
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    background?: string;

    @Min(1)
    @IsInt()
    projectId: number;
}
