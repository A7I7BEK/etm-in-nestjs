import { modifyCheckListGroupForFront } from 'src/check-list-groups/utils/modify-check-list-group-for-front.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { modifyTaskAttachmentForFront } from 'src/task-attachments/utils/modify-task-attachment-for-front.util';
import { modifyTaskCommentForFront } from 'src/task-comments/utils/modify-task-comment-for-front.util';
import { modifyTaskMemberForFront } from 'src/task-members/utils/modify-task-member-for-front.util';
import { modifyTaskTagForFront } from 'src/task-tags/utils/modify-task-tag-for-front.util';
import { TasksService } from '../tasks.service';
import { modifyTaskForFront } from './modify-task-for-front.util';


export async function getTaskDetails
    (
        service: TasksService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                project: true,
                column: true,
                checkListGroups: {
                    checkList: {
                        checkListGroup: true,
                        members: {
                            user: true
                        }
                    }
                },
                comments: {
                    author: {
                        user: true
                    },
                    members: {
                        user: true
                    }
                },
                members: {
                    projectMember: {
                        employee: {
                            user: true
                        }
                    }
                },
                attachments: {
                    file: true
                },
                tags: {
                    projectTag: true
                }
            },
        },
        activeUser,
    );


    modifyTaskForFront(entity);
    entity.checkListGroups.forEach(item => modifyCheckListGroupForFront(item));
    entity.comments.forEach(item => modifyTaskCommentForFront(item));
    entity[ 'commentsCount' ] = entity.comments.length;
    entity.members.forEach(item => modifyTaskMemberForFront(item));
    entity[ 'actions' ] = [];
    entity[ 'actionsCount' ] = 123;
    entity.attachments.forEach(item => modifyTaskAttachmentForFront(item));
    entity.tags.forEach(item => modifyTaskTagForFront(item));


    return entity;
}
