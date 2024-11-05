import { IsEnum, IsOptional } from 'class-validator';
import { PageFilterDto } from 'src/common/dto/page-filter.dto';
import { OrganizationProperties } from '../enums/organization-properties.enum';

export class OrganizationPageFilterDto extends PageFilterDto<OrganizationProperties>
{
    @IsOptional()
    @IsEnum(OrganizationProperties)
    sortBy?: OrganizationProperties = OrganizationProperties.ID;
}