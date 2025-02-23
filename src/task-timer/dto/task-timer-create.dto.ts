import { IsEnum, IsInt, Min } from 'class-validator';
import { TaskTimerStatus } from '../enums/task-timer-status.enum';

export class TaskTimerCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @IsEnum(TaskTimerStatus)
    timerStatus: TaskTimerStatus;
}
