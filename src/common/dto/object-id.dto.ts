import { IsPositive } from 'class-validator';

export class ObjectIdDto
{
    @IsPositive()
    id: number;
}
