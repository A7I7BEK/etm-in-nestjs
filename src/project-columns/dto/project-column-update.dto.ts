import { OmitType } from '@nestjs/swagger';
import { ProjectColumnCreateDto } from './project-column-create.dto';

export class ProjectColumnUpdateDto extends OmitType(
    ProjectColumnCreateDto,
    [ 'projectId' ],
) { }
