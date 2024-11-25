import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { ProjectTagProperties } from '../enums/project-tag-properties.enum';

export class ProjectTagQueryDto extends BaseQueryDto<ProjectTagProperties>
{
    @IsOptional()
    @IsEnum(ProjectTagProperties)
    sortBy?: ProjectTagProperties = ProjectTagProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}