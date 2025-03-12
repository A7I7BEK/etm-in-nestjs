import { IsInt, Min } from 'class-validator';

export class ShareTaskDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @Min(1, { each: true })
    @IsInt({ each: true })
    employeeIds: number[];
}
