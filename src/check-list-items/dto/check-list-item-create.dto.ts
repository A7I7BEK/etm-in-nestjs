import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class CheckListItemCreateDto
{
    @IsNotEmpty()
    @IsString()
    text: string;

    @ArrayMinSize(0)
    @ValidateNested({ each: true })
    @Type(() => ObjectIdDto)
    members: ObjectIdDto[];

    @Min(1)
    @IsInt()
    checkListGroupId: number;
}
