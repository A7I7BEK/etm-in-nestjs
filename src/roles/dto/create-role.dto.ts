import { IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class CreateRoleDto
{
    @IsString()
    @IsNotEmpty()
    roleName: string;

    @IsString()
    @IsNotEmpty()
    codeName: string;

    @ValidateNested()
    permissions: ObjectIdDto[];

    @IsPositive()
    organizationId: number;
}
