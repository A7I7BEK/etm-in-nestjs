import { Injectable } from '@nestjs/common';
import { CreateCheckListGroupDto } from './dto/create-check-list-group.dto';
import { UpdateCheckListGroupDto } from './dto/update-check-list-group.dto';

@Injectable()
export class CheckListGroupsService
{
    create(createCheckListGroupDto: CreateCheckListGroupDto)
    {
        return 'This action adds a new checkListGroup';
    }

    findAll()
    {
        return `This action returns all checkListGroups`;
    }

    findOne(id: number)
    {
        return `This action returns a #${id} checkListGroup`;
    }

    update(id: number, updateCheckListGroupDto: UpdateCheckListGroupDto)
    {
        return `This action updates a #${id} checkListGroup`;
    }

    remove(id: number)
    {
        return `This action removes a #${id} checkListGroup`;
    }
}
