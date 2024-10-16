import { Type } from 'class-transformer';
import { ArrayMinSize, IsPositive, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class AttachRoleDto
{
    @IsPositive()
    userId: number;

    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ObjectIdDto)
    roles: ObjectIdDto[];
}
