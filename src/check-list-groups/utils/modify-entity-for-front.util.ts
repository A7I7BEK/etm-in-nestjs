import { modifyCheckListItemForFront } from 'src/check-list-items/utils/modify-check-list-item-for-front.util';
import { CheckListGroup } from '../entities/check-list-group.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyCheckListGroupForFront(entity: CheckListGroup)
{
    const { checkList, task } = entity;


    if (checkList)
    {
        entity.checkList =
            entity.checkList.map(item => modifyCheckListItemForFront(item));
    }


    if (task)
    {
        Object.assign(entity, {
            taskId: task.id,
            taskName: task.name,
        });
    }


    return entity;
}