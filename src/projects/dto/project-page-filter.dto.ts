import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { ProjectProperties } from '../enums/project-properties.enum';
import { ProjectType } from '../enums/project-type';

export class ProjectPageFilterDto extends PageFilterDto<ProjectProperties>
{
    @IsOptional()
    @IsEnum(ProjectProperties)
    sortBy?: ProjectProperties = ProjectProperties.ID;

    @IsOptional()
    @IsEnum(ProjectType)
    projectType?: ProjectType;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    groupId?: number;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    managerId?: number;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}