import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';

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
    @IsNumberString({ no_symbols: true })
    @IsPhoneNumber('UZ')
    phoneNumber: string;
}
