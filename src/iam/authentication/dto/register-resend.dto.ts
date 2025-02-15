import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RegisterResendDto
{
    @ApiProperty({ example: '1234-asdf-1234-asdf-1234' })
    @IsUUID()
    otpId: string;
}
