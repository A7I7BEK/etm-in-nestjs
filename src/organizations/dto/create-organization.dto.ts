import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto
{
    @ApiProperty({ example: 'Google' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'aaa@aaa.aaa' })
    @IsEmail()
    email: string;
}
