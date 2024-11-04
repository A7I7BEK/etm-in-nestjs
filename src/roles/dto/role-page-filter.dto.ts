import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { RoleProperties } from '../enums/role-properties.enum';

// BINGO
export class RolePageFilterDto extends PageFilterDto<RoleProperties>
{
    @IsOptional()
    @IsEnum(RoleProperties)
    sortBy?: RoleProperties = RoleProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}