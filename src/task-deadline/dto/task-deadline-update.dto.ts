import { IsNotEmpty, IsString } from 'class-validator';
import { TaskDeadlineCreateDto } from './task-deadline-create.dto';

export class TaskDeadlineUpdateDto extends TaskDeadlineCreateDto
{
    @IsNotEmpty()
    @IsString()
    changesComment: string;
}
