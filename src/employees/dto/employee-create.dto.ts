import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class EmployeeCreateDto
{
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    middleName?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: Date;

    @IsOptional()
    @ValidateNested() // BINGO
    @Type(() => ObjectIdDto) // BINGO
    resourceFile?: ObjectIdDto; // BINGO
}
