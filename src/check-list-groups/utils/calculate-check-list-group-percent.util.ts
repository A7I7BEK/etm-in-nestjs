import { CheckListGroup } from '../entities/check-list-group.entity';


export function calculateCheckListGroupPercent(entity: CheckListGroup)
{
    const { checkList } = entity;


    if (checkList)
    {
        const totalCount = checkList.length;
        const checkedCount = checkList.filter(item => item.checked).length;
        const percent = Math.floor(checkedCount / totalCount * 100);

        Object.assign(entity, { percent });
    }


    return entity;
}