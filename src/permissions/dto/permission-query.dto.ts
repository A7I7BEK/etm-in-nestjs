import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { PermissionProperties } from '../enums/permission-properties.enum';

export class PermissionQueryDto extends BaseQueryDto<PermissionProperties>
{
    @IsOptional()
    @IsEnum(PermissionProperties)
    sortBy?: PermissionProperties = PermissionProperties.ID;
}