import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto
{
    @ApiProperty({ example: 123 })
    @IsNumber()
    organizationId: number;

    @ApiProperty({ example: 123 })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'johnny' })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '901234567' })
    @IsPhoneNumber('UZ')
    phoneNumber: string;
}
