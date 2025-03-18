import { OmitType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CheckListItemCreateDto } from './check-list-item-create.dto';

export class CheckListItemUpdateDto extends
    OmitType(CheckListItemCreateDto, [ 'employeeIds', 'checkListGroupId' ])
{
    @IsBoolean()
    checked: boolean;
}
