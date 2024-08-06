import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto
{
    @ApiProperty({ example: 'Google' })
    organizationName: string;

    @ApiProperty({ example: 'johnny' })
    userName: string;

    @ApiProperty({ example: 'John' })
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    lastName: string;

    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '901234567' })
    phoneNumber: string;

    @ApiProperty({ example: 'pass:123456789' })
    @MinLength(10)
    password: string;
}
