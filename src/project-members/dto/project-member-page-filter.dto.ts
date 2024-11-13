import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { ProjectMemberProperties } from '../enums/project-member-properties.enum';

export class ProjectMemberPageFilterDto extends PageFilterDto<ProjectMemberProperties>
{
    @IsOptional()
    @IsEnum(ProjectMemberProperties)
    sortBy?: ProjectMemberProperties = ProjectMemberProperties.ID;

    @Min(1)
    @IsInt()
    @Type(() => Number)
    projectId: number;
}