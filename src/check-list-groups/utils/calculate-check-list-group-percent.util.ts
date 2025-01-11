import { CheckListGroup } from '../entities/check-list-group.entity';


export function calculateCheckListGroupPercent(entity: CheckListGroup)
{
    const { checkList } = entity;


    if (checkList?.length)
    {
        const totalCount = checkList.length;
        const checkedCount = checkList.filter(item => item.checked).length;
        const percent = Math.floor(checkedCount / totalCount * 100);

        Object.assign(entity, { percent });
    }
    else
    {
        Object.assign(entity, { percent: 0 });
    } // TODO: check if this is correct


    return entity;
}
