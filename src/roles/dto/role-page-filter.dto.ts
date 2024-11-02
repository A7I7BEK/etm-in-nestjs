import { IsEnum, IsOptional } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { RoleProperties } from '../enums/role-properties.enum';

// BINGO
export class RolePageFilterDto extends PageFilterDto<RoleProperties>
{
    @IsOptional()
    @IsEnum(RoleProperties)
    sortBy?: RoleProperties = RoleProperties.ID;
}