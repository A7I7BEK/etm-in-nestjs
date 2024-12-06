import { OmitType } from '@nestjs/swagger';
import { TaskCommentCreateDto } from './task-comment-create.dto';

export class TaskCommentUpdateDto extends OmitType(TaskCommentCreateDto, [ 'taskId' ]) { }
