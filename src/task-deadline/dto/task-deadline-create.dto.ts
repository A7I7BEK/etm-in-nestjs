import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class TaskDeadlineCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @IsNotEmpty()
    @IsString()
    startDate: string;

    @IsNotEmpty()
    @IsString()
    deadLine: string;
}
