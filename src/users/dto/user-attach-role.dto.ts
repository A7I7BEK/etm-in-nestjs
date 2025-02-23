import { IsInt, Min } from 'class-validator';

export class UserAttachRoleDto
{
    @Min(1)
    @IsInt()
    userId: number;

    @Min(1, { each: true }) // BINGO: simplify getting ids
    @IsInt({ each: true }) // BINGO: simplify getting ids
    roleIds: number[];
}
