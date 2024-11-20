import { OmitType } from '@nestjs/swagger';
import { ProjectCreateDto } from './project-create.dto';

export class ProjectUpdateDto extends OmitType(ProjectCreateDto, [ 'projectType' ]) { }
