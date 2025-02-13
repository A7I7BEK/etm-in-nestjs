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
                },
            },
        },
        activeUser,
    );


    const [ actionList, actionCount ] = await service.actionsService.repository.findAndCount({
        where: {
            task: {
                id,
            },
            project: {
                organization: {
                    id: activeUser.orgId
                }
            },
        },
        relations: {
            task: true,
            employee: true,
        },
        order: {
            id: 'DESC'
        },
        take: 10,
    });
    entity.actions = actionList;
    entity[ 'actionsCount' ] = actionCount;


    const [ commentList, commentCount ] = await service.taskCommentsService.repository.findAndCount({
        where: {
            task: {
                id,
                project: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            },
        },
        relations: {
            author: {
                user: true
            },
            members: {
                user: true
            }
        },
        order: {
            id: 'DESC'
        },
        take: 10,
    });
    entity.comments = commentList.map(item => modifyTaskCommentForFront(item));
    entity[ 'commentsCount' ] = commentCount;


    modifyTaskForFront(entity);
    entity.checkListGroups.forEach(item => modifyCheckListGroupForFront(item));
    entity.members.forEach(item => modifyTaskMemberForFront(item));
    entity.attachments.forEach(item => modifyTaskAttachmentForFront(item));
    entity.tags.forEach(item => modifyTaskTagForFront(item));


    return entity;
}
