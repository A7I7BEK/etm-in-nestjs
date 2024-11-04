import { IsInt, Min } from 'class-validator';

export class ObjectIdDto
{
    @Min(1)
    @IsInt()
    id: number;
}
