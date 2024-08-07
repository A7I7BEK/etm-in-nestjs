import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto
{
    @ApiProperty({ example: 'johnny' })
    @IsEmail()
    userName: string;

    @ApiProperty({ example: 'pass:123456789' })
    @MinLength(10)
    password: string;
}
