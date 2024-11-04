import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class AttachRoleDto
{
    @Min(1)
    @IsInt()
    userId: number;

    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ObjectIdDto)
    roles: ObjectIdDto[];
}
