import { TaskCommentType } from 'src/task-comments/enums/task-comment-type.enum';
import { modifyTaskMemberForFront } from 'src/task-members/utils/modify-task-member-for-front.util';
import { modifyTaskTagForFront } from 'src/task-tags/utils/modify-task-tag-for-front.util';
import { Task } from '../entities/task.entity';
import { modifyTaskForFront } from './modify-task-for-front.util';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskForProject(entity: Task)
{
    const { checkListGroups, comments } = entity;


    modifyTaskForFront(entity);


    // TODO: Check if this is correct
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
        const commentType = entity.comments[ 0 ].commentType;
        Object.assign(entity, {
            commentCount: entity.comments.length,
            lastCommentType: {
                id: commentType,
                name: TaskCommentType[ commentType ],
                value: TaskCommentType[ commentType ],
            },
        });
    }
    delete entity.comments;


    entity.members?.forEach(item => modifyTaskMemberForFront(item));
    entity.tags?.forEach(item => modifyTaskTagForFront(item));


    return entity;
}