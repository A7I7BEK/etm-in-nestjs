import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RoleCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @Min(1, { each: true })
    @IsInt({ each: true })
    permissionIds: number[];

    @Min(0)
    @IsInt()
    organizationId: number;
}
