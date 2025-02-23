import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ProjectType } from '../enums/project-type.enum';

export class ProjectCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEnum(ProjectType)
    projectType: ProjectType;

    @Min(1)
    @IsInt()
    groupId: number;

    @Min(1)
    @IsInt()
    managerId: number;

    @Min(0)
    @IsInt()
    organizationId: number;
}
