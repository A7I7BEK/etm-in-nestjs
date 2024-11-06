import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { UserProperties } from '../../users/enums/user-properties.enum';
import { EmployeeProperties } from '../enums/employee-properties.enum';

export class EmployeePageFilterDto extends PageFilterDto<EmployeeProperties | UserProperties> // BINGO
{
    @IsOptional()
    @IsEnum({ ...UserProperties, ...EmployeeProperties }) // BINGO
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
    projectId?: number; // TODO
}