import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class GroupCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ObjectIdDto)
    userIds: ObjectIdDto[];

    @Min(1)
    @IsInt()
    leaderId: number;

    @Min(0)
    @IsInt()
    organizationId: number;
}
