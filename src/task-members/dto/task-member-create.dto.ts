import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class TaskMemberCreateDto
{
    @IsNotEmpty()
    @IsString()
    roleName: string;

    @IsNotEmpty()
    @IsString()
    codeName: string;

    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ObjectIdDto)
    permissions: ObjectIdDto[];

    @Min(0)
    @IsInt()
    organizationId: number;
}
