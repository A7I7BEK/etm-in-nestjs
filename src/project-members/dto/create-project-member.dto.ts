import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';

export class CreateProjectMemberDto
{
    @Min(1)
    @IsInt()
    projectId: number;

    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ObjectIdDto)
    userIds: ObjectIdDto[];
}
