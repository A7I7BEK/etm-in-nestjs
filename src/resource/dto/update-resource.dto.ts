import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateResourceDto
{
    @IsNotEmpty()
    @IsString()
    name: string;
}
