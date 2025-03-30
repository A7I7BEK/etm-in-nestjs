import { IsInt, Min } from 'class-validator';

export class DeleteResourceByIdDto
{
    @Min(1)
    @IsInt()
    id: number;
}
