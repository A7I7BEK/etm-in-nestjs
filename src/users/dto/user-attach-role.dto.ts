import { IsInt, Min } from 'class-validator';

export class UserAttachRoleDto
{
    @Min(1)
    @IsInt()
    userId: number;

    @Min(1, { each: true }) // BINGO
    @IsInt({ each: true }) // BINGO
    roleIds: number[];
}
