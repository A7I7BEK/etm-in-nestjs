import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { CheckListGroupProperties } from '../enums/check-list-group-properties.enum';

export class CheckListGroupQueryDto extends BaseQueryDto<CheckListGroupProperties>
{
    @IsOptional()
    @IsEnum(CheckListGroupProperties)
    sortBy?: CheckListGroupProperties = CheckListGroupProperties.ID;

    @Min(1)
    @IsInt()
    @Type(() => Number)
    taskId: number;
}