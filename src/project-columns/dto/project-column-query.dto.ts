import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { ProjectColumnProperties } from '../enums/project-column-properties.enum';

// BINGO
export class ProjectColumnQueryDto extends BaseQueryDto<ProjectColumnProperties>
{
    @IsOptional()
    @IsEnum(ProjectColumnProperties)
    sortBy?: ProjectColumnProperties = ProjectColumnProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}