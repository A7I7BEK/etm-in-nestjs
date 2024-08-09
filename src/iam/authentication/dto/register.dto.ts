import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto
{
    @ApiProperty({ example: 'Google' })
    @IsString()
    @IsNotEmpty()
    organizationName: string;

    @ApiProperty({ example: 'johnny' })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '901234567' })
    @IsPhoneNumber('UZ')
    phoneNumber: string;

    @ApiProperty({ example: 'pass:123456789' })
    @MinLength(10)
    password: string;
}
