import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { GroupProperties } from '../enums/group-properties.enum';

export class GroupQueryDto extends BaseQueryDto<GroupProperties>
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