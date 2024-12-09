import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { CheckListItemProperties } from '../enums/check-list-item-properties.enum';

export class CheckListItemQueryDto extends BaseQueryDto<CheckListItemProperties>
{
    @IsOptional()
    @IsEnum(CheckListItemProperties)
    sortBy?: CheckListItemProperties = CheckListItemProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;
}