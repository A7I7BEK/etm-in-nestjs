import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class CreateRoleDto
{
    @IsNotEmpty()
    @IsString()
    roleName: string;

    @IsNotEmpty()
    @IsString()
    codeName: string;

    @ValidateNested({ each: true }) // BINGO
    @ArrayMinSize(1)
    @Type(() => ObjectIdDto)
    permissions: ObjectIdDto[];

    @Min(0)
    @IsInt()
    organizationId: number;
}
