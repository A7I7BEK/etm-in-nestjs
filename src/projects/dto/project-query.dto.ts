import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { ProjectProperties } from '../enums/project-properties.enum';
import { ProjectType } from '../enums/project-type';

export class ProjectQueryDto extends BaseQueryDto<ProjectProperties>
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