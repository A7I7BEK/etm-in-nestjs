import { modifyCheckListItemForFront } from 'src/check-list-items/utils/modify-check-list-item-for-front.util';
import { CheckListGroup } from '../entities/check-list-group.entity';
import { calculateCheckListGroupPercent } from './calculate-check-list-group-percent.util';

/**
 * temporary for this project, must not exist
 */
export function modifyCheckListGroupForFront(entity: CheckListGroup)
{
    const { task } = entity;


    calculateCheckListGroupPercent(entity);


    entity.checkList?.forEach(item => modifyCheckListItemForFront(item));


    if (task)
    {
        Object.assign(entity, {
            taskId: task.id,
            taskName: task.name,
        });
    }


    return entity;
}