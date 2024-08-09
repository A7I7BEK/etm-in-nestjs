import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInstance, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResourceFileDto } from './resource-file.dto';

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
    @IsOptional()
    middleName: string;

    @ApiProperty({ type: Date })
    @IsDate()
    @IsOptional()
    birthDate: Date;

    @ApiProperty({ type: ResourceFileDto })
    @IsInstance(ResourceFileDto)
    resourceFile: ResourceFileDto;

    @ApiProperty({ type: CreateUserDto })
    @IsInstance(CreateUserDto)
    user: CreateUserDto;
}
