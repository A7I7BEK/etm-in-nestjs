import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsPhoneNumber } from 'class-validator';

export class ForgotPasswordSendDto
{
    @ApiProperty({ examples: [ 'aaa@aaa.aaa', '901234567' ] })
    @IsEmail()
    // @IsMobilePhone('uz-UZ')
    @IsPhoneNumber('UZ')
    paramForSendingOtp: string;
}
