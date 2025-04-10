import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { RoleProperties } from '../enum/role-properties.enum';

// BINGO: extend and customize abstract class
export class RoleQueryDto extends BaseQueryDto<RoleProperties>
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