import { IsPositive } from 'class-validator';

export class ResourceFileDto
{
    @IsPositive()
    id: number;
}
