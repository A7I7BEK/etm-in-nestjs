import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber, IsPositive, IsString } from 'class-validator';

export class UpdateUserDto
{
    @IsPositive()
    organizationId: number;

    @ApiProperty({ example: 'johnny' })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '901234567' })
    @IsNumberString({ no_symbols: true })
    @IsPhoneNumber('UZ')
    phoneNumber: string;
}
