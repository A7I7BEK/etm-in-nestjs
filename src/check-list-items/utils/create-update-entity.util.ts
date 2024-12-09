import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { In } from 'typeorm';
import { CheckListItemsService } from '../check-list-items.service';
import { CheckListItemCreateDto } from '../dto/check-list-item-create.dto';
import { CheckListItemUpdateDto } from '../dto/check-list-item-update.dto';
import { CheckListItem } from '../entities/check-list-item.entity';


export async function createUpdateEntity
    (
        service: CheckListItemsService,
        dto: CheckListItemCreateDto | CheckListItemUpdateDto,
        activeUser: ActiveUserData,
        entity = new CheckListItem(),
    )
{
    if (dto instanceof CheckListItemCreateDto)
    {
        entity.checkListGroup = await service.chGroupsService.findOne(
            {
                where: { id: dto.checkListGroupId },
                relations: { task: true }
            },
            activeUser,
        );


        entity.task = entity.checkListGroup.task;


        const memberIds = dto.members.map(x => x.id);
        entity.members = await service.employeesService.findAll(
            {
                where: { id: In(memberIds) }
            },
            activeUser,
        );
    }
    else
    {
        entity.checked = dto.checked;
    }


    entity.text = dto.text;


    return service.repository.save(entity);
}
