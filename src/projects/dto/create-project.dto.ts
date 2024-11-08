import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { ObjectIdDto } from 'src/common/dto/object-id.dto';
import { ProjectType } from '../enums/project-type';

export class CreateProjectDto
{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    codeName: string;

    @IsEnum(ProjectType)
    projectType: ProjectType;

    @ValidateNested()
    @Type(() => ObjectIdDto)
    group: ObjectIdDto;

    @ValidateNested()
    @Type(() => ObjectIdDto)
    manager: ObjectIdDto;

    @IsInt()
    @Min(0)
    organizationId: number;
}
