import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { UserProperties } from '../../users/enums/user-properties.enum';
import { EmployeeProperties } from '../enums/employee-properties.enum';

export class EmployeeQueryDto extends BaseQueryDto<EmployeeProperties | UserProperties> // BINGO: union of enums
{
    @IsOptional()
    @IsEnum({ ...UserProperties, ...EmployeeProperties }) // BINGO: union of enums
    sortBy?: EmployeeProperties | UserProperties = EmployeeProperties.ID;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    organizationId?: number;

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    projectId?: number;
}