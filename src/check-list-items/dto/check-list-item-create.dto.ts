import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class CheckListItemCreateDto
{
    @IsNotEmpty()
    @IsString()
    text: string;

    @ArrayMinSize(0) // BINGO: check array for existing number of elements
    @ValidateNested({ each: true }) // BINGO: check each nested object in the array
    @Type(() => ObjectIdDto) // BINGO: transform nested DTO
    employeeIds: ObjectIdDto[]; // BINGO: nested DTO

    @Min(1)
    @IsInt()
    checkListGroupId: number;
}
