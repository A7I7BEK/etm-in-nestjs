import { PickType } from '@nestjs/swagger';
import { ProjectColumnCreateDto } from './project-column-create.dto';

export class ProjectColumnSelectQueryDto extends PickType(
    ProjectColumnCreateDto,
    [ 'projectId' ],
) { }