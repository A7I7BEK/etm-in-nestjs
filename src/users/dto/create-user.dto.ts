import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateUserDto
{
    @IsPositive()
    organizationId: number;

    @ApiProperty({ example: 'johnny' })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ example: 'pass:123456789' })
    @MinLength(10)
    password: string;

    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '901234567' })
    @IsPhoneNumber('UZ')
    phoneNumber: string;
}
