import { OmitType } from '@nestjs/swagger';
import { ProjectTagCreateDto } from './project-tag-create.dto';

export class ProjectTagUpdateDto extends OmitType(
    ProjectTagCreateDto,
    [ 'projectId' ],
) { }
