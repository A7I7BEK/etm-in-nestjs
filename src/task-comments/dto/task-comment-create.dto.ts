import { Type } from 'class-transformer';
import { ArrayMinSize, IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';
import { TaskCommentType } from '../enums/task-comment-type.enum';

export class TaskCommentCreateDto
{
    @IsNotEmpty()
    @IsString()
    commentText: string;

    @IsEnum(TaskCommentType)
    commentType: TaskCommentType;

    @ArrayMinSize(0)
    @ValidateNested({ each: true })
    @Type(() => ObjectIdDto)
    members: ObjectIdDto[];

    @Min(1)
    @IsInt()
    taskId: number;
}
