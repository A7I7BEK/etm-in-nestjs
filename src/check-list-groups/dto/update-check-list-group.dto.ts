import { PartialType } from '@nestjs/swagger';
import { CreateCheckListGroupDto } from './create-check-list-group.dto';

export class UpdateCheckListGroupDto extends PartialType(CreateCheckListGroupDto) { }
