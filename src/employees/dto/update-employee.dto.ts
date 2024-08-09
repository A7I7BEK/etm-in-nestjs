import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInstance, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ResourceFileDto } from './resource-file.dto';

export class UpdateEmployeeDto
{
    @IsPositive()
    id: number;

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

    @IsDate()
    @IsOptional()
    birthDate: Date;

    @IsInstance(ResourceFileDto)
    resourceFile: ResourceFileDto;

    @IsInstance(UpdateUserDto)
    user: UpdateUserDto;
}
