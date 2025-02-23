import { Type } from 'class-transformer';
import { IsDate, IsInt, Min } from 'class-validator';

export class TaskDeadlineCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    endDate: Date;
}
