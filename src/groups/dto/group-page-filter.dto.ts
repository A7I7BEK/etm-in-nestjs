import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { GroupProperties } from '../enums/group-properties.enum';

export class GroupPageFilterDto extends PageFilterDto<GroupProperties>
{
    @IsOptional()
    @IsEnum(GroupProperties)
    sortBy?: GroupProperties = GroupProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}