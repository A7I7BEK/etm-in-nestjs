import { Validate } from 'class-validator';
import { EmailOrPhoneConstraint } from 'src/common/custom-class-validator/email-or-phone.constraint';

export class ForgotPasswordSendDto
{
    @Validate(EmailOrPhoneConstraint) // BINGO
    contactEmailOrPhone: string;
}
