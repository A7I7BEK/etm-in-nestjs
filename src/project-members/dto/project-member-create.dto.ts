import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class ProjectMemberCreateDto
{
    @Min(1)
    @IsInt()
    projectId: number;

    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ObjectIdDto)
    userIds: ObjectIdDto[];
}
