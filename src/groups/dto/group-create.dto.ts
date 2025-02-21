import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class GroupCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @Min(1, { each: true })
    @IsInt({ each: true })
    employeeIds: number[];

    @Min(1)
    @IsInt()
    leaderId: number;

    @Min(0)
    @IsInt()
    organizationId: number;
}
