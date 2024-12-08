import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class TaskAttachmentCreateDto
{
    @Min(1)
    @IsInt()
    taskId: number;

    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ObjectIdDto)
    attachments: ObjectIdDto[];
}
