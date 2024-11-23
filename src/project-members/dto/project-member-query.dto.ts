import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { ProjectMemberProperties } from '../enums/project-member-properties.enum';

export class ProjectMemberQueryDto extends BaseQueryDto<ProjectMemberProperties>
{
    @IsOptional()
    @IsEnum(ProjectMemberProperties)
    sortBy?: ProjectMemberProperties = ProjectMemberProperties.ID;

    @Min(1)
    @IsInt()
    @Type(() => Number)
    projectId: number;
}