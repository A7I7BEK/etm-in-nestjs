import { IsDate, IsInt, Min } from 'class-validator';

export class TaskDeadlineCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @IsDate()
    startDate: Date;

    @IsDate()
    deadLine: Date;
}
