import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

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
    @IsString()
    @IsOptional()
    middleName?: string;

    @IsDate()
    @IsOptional()
    birthDate?: Date;

    @ValidateNested()
    @Type(() => ObjectIdDto)
    resourceFile: ObjectIdDto;

    @ValidateNested()
    @Type(() => UpdateUserDto)
    user: UpdateUserDto;
}
