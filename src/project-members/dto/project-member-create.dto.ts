import { IsInt, Min } from 'class-validator';

export class ProjectMemberCreateDto
{
    @Min(1)
    @IsInt()
    projectId: number;

    @Min(1, { each: true })
    @IsInt({ each: true })
    employeeIds: number[];
}
