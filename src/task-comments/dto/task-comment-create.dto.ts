import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { TaskCommentType } from '../enums/task-comment-type.enum';

export class TaskCommentCreateDto
{
    @IsNotEmpty()
    @IsString()
    commentText: string;

    @IsEnum(TaskCommentType)
    commentType: TaskCommentType;

    @Min(0, { each: true })
    @IsInt({ each: true })
    employeeIds: number[];

    @Min(1)
    @IsInt()
    taskId: number;
}
