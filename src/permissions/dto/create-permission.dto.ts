import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PermissionType } from 'src/iam/authorization/permission.type';

export class CreatePermissionDto
{
    @ApiProperty({ example: 'Task Update' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'TASK_UPDATE' })
    @IsString()
    @IsNotEmpty()
    codeName: PermissionType;
}
