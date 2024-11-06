import { IsEnum, IsOptional } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { PermissionProperties } from '../enums/permission-properties.enum';

export class PermissionPageFilterDto extends PageFilterDto<PermissionProperties>
{
    @IsOptional()
    @IsEnum(PermissionProperties)
    sortBy?: PermissionProperties = PermissionProperties.ID;
}