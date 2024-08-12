import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, MinLength } from 'class-validator';

export class ForgotPasswordChangeDto
{
    @ApiProperty({ example: '1234-asdf-1234-asdf-1234' })
    @IsUUID()
    uniqueKey: string;

    @ApiProperty({ example: 'pass:123456789' })
    @MinLength(10)
    password: string;
}
