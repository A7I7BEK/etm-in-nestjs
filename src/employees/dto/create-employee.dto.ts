import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
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
    @IsOptional()
    middleName?: string;

    @IsDate()
    @IsOptional()
    birthDate?: Date;

    @ValidateNested()
    resourceFile: ObjectIdDto;

    @ValidateNested()
    user: CreateUserDto;
}
