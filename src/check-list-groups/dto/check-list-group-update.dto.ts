import { OmitType } from '@nestjs/swagger';
import { CheckListGroupCreateDto } from './check-list-group-create.dto';

export class CheckListGroupUpdateDto extends OmitType(CheckListGroupCreateDto, [ 'taskId' ]) { }
