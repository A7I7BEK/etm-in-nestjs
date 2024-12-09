import { OmitType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CheckListItemCreateDto } from './check-list-item-create.dto';

export class CheckListItemUpdateDto extends
    OmitType(CheckListItemCreateDto, [ 'members', 'checkListGroupId' ])
{
    @IsBoolean()
    checked: boolean;
}
