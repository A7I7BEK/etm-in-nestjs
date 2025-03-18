import { Task } from '../entities/task.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskForBoard(entity: Task)
{
    const { checkListGroups, comments } = entity;


    if (checkListGroups?.length && checkListGroups.some(a => a.checkList))
    {
        const allChecklist = entity.checkListGroups.flatMap(item => item.checkList);
        Object.assign(entity, {
            checkListCount: {
                totalCount: allChecklist.length,
                checkedCount: allChecklist.filter(a => a.checked).length,
            },
        });
    }
    delete entity.checkListGroups;


    if (comments?.length)
    {
        Object.assign(entity, {
            commentCount: entity.comments.length,
            lastCommentType: entity.comments[ 0 ].commentType,
        });
    }
    delete entity.comments;


    return entity;
}