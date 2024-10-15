import { MinLength } from 'class-validator';

export class PasswordChangeDto
{
    @MinLength(10)
    newPassword: string;
}
