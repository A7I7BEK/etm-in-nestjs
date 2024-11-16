import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, Min, MinLength } from 'class-validator';

export class UserCreateDto
{
    @IsInt()
    @Min(0)
    organizationId: number;

    @ApiProperty({ example: 'johnny' })
    @IsNotEmpty()
    @IsString()
    userName: string;

    @ApiProperty({ example: 'pass:123456789' })
    @MinLength(10)
    password: string;

    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '901234567' })
    @IsPhoneNumber('UZ')
    @IsNumberString({ no_symbols: true })
    phoneNumber: string;
}
