import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInstance, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ResourceFileDto } from './resource-file.dto';

export class UpdateEmployeeDto
{
    @ApiProperty({ example: 123 })
    @IsNumber()
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

    @ApiProperty({ type: Date })
    @IsDate()
    @IsOptional()
    birthDate: Date;

    @ApiProperty({ type: ResourceFileDto })
    @IsInstance(ResourceFileDto)
    resourceFile: ResourceFileDto;

    @ApiProperty({ type: UpdateUserDto })
    @IsInstance(UpdateUserDto)
    user: UpdateUserDto;
}
