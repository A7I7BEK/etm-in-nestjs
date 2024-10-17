import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsPositive, IsString, Min, ValidateNested } from 'class-validator';
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

    @IsPositive()
    leaderId: number;

    @IsInt()
    @Min(0)
    organizationId: number;
}
