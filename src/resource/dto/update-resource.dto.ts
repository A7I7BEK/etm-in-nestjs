import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateResourceDto
{
    @IsString()
    @IsNotEmpty()
    name: string;
}
