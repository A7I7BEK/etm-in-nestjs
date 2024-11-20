import { PickType } from '@nestjs/swagger';
import { ProjectPageFilterDto } from './project-page-filter.dto';

export class ProjectSelectPageFilterDto extends PickType(
    ProjectPageFilterDto,
    [ 'projectType', 'organizationId' ],
) { }