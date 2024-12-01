import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';
import { ProjectType } from '../enums/project-type.enum';

export class ProjectCreateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    codeName: string;

    @IsEnum(ProjectType)
    projectType: ProjectType;

    @ValidateNested()
    @Type(() => ObjectIdDto)
    group: ObjectIdDto;

    @ValidateNested()
    @Type(() => ObjectIdDto)
    manager: ObjectIdDto;

    @Min(0)
    @IsInt()
    organizationId: number;
}
