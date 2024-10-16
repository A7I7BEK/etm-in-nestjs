import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateEmployeeDto
{
    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'Tom' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    middleName?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: Date;

    @ValidateNested() // BINGO
    @Type(() => ObjectIdDto) // BINGO
    @IsOptional()
    resourceFile?: ObjectIdDto; // BINGO

    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;
}
