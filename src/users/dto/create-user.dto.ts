import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto
{
    @IsInt()
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
    @IsNumberString({ no_symbols: true })
    @IsPhoneNumber('UZ')
    phoneNumber: string;
}
