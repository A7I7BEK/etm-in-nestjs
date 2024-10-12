import { Type } from 'class-transformer';
import { ArrayMinSize, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class CreateRoleDto
{
    @IsString()
    @IsNotEmpty()
    roleName: string;

    @IsString()
    @IsNotEmpty()
    codeName: string;

    @ValidateNested({ each: true }) // BINGO
    @ArrayMinSize(1)
    @Type(() => ObjectIdDto)
    permissions: ObjectIdDto[];

    @IsPositive()
    organizationId: number;
}
