import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { OrganizationProperties } from '../enums/organization-properties.enum';

export class OrganizationQueryDto extends BaseQueryDto<OrganizationProperties>
{
    @IsOptional()
    @IsEnum(OrganizationProperties)
    sortBy?: OrganizationProperties = OrganizationProperties.ID;
}