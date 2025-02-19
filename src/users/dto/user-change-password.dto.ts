import { IsInt, Min, MinLength } from 'class-validator';

export class UserChangePasswordDto
{
    @Min(1)
    @IsInt()
    userId: number;

    @MinLength(10)
    newPassword: string;
}
