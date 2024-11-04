import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class CreateGroupDto
{
    @IsString()
    @IsNotEmpty()
    name: string;

    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ObjectIdDto)
    userIds: ObjectIdDto[];

    @Min(1)
    @IsInt()
    leaderId: number;

    @Min(0)
    @IsInt()
    organizationId: number;
}
