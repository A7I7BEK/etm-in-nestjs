import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ProjectColumnSelectQueryDto
{
    @Min(1)
    @IsInt()
    @Type(() => Number)
    projectId: number;
}