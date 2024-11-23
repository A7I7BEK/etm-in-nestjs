import { PickType } from '@nestjs/swagger';
import { ProjectQueryDto } from './project-query.dto';

export class ProjectSelectQueryDto extends PickType(
    ProjectQueryDto,
    [ 'projectType', 'organizationId' ],
) { }