import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CheckListGroupCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @Min(1)
    @IsInt()
    taskId: number;
}
