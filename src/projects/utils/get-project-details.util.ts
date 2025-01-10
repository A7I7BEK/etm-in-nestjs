import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCommentType } from 'src/task-comments/enums/task-comment-type.enum';
import { modifyTaskMemberForFront } from 'src/task-members/utils/modify-task-member-for-front.util';
import { modifyTaskTagForFront } from 'src/task-tags/utils/modify-task-tag-for-front.util';
import { TaskLevel } from 'src/tasks/enums/task-level.enum';
import { TaskPriority } from 'src/tasks/enums/task-priority.enum';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';
import { ProjectsService } from '../projects.service';
import { modifyProjectForFront } from './modify-project-for-front.util';


export async function getProjectDetails
    (
        service: ProjectsService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                columns: {
                    tasks: {
                        checkListGroups: {
                            checkList: true
                        },
                        comments: true,
                        members: {
                            projectMember: {
                                employee: {
                                    user: true
                                }
                            }
                        },
                        tags: {
                            projectTag: true
                        }
                    }
                },
                group: true,
                manager: true,
                members: {
                    employee: {
                        user: true
                    }
                },
                tags: true,
                organization: true,
            },
            order: {
                columns: {
                    tasks: {
                        comments: {
                            id: 'DESC'
                        },
                    }
                },
            },
        },
        activeUser,
    );


    modifyProjectForFront(entity);
    entity[ 'actions' ] = [];
    entity[ 'actionsCount' ] = 123;


    entity.columns?.forEach(col => // TODO: Check if this is correct
    {
        col.tasks?.forEach(task =>
        {
            const allChecklist = task.checkListGroups.flatMap(item => item.checkList);
            Object.assign(task, {
                checkListCount: {
                    totalCount: allChecklist.length,
                    checkedCount: allChecklist.filter(a => a.checked).length,
                },
            });
            delete task.checkListGroups;

            if (task.comments.length)
            {
                const commentType = task.comments[ 0 ].commentType;
                Object.assign(task, {
                    commentCount: task.comments.length,
                    lastCommentType: {
                        id: commentType,
                        name: TaskCommentType[ commentType ],
                        value: TaskCommentType[ commentType ],
                    },
                });
            }
            delete task.comments;

            task.members.forEach(item => modifyTaskMemberForFront(item));
            task.tags.forEach(item => modifyTaskTagForFront(item));
        });
    });


    entity[ 'taskStatusType' ] = Object.keys(TaskStatus).filter(a => Number(a))
        .map(item =>
        {
            return {
                id: Number(item),
                name: TaskStatus[ item ],
                value: TaskStatus[ item ],
            };
        });


    entity[ 'taskPriorityType' ] = Object.keys(TaskPriority).filter(a => Number(a))
        .map(item =>
        {
            return {
                id: Number(item),
                name: TaskPriority[ item ],
                value: TaskPriority[ item ],
            };
        });


    entity[ 'taskLevelType' ] = Object.keys(TaskLevel).filter(a => Number(a))
        .map(item =>
        {
            return {
                id: Number(item),
                name: TaskLevel[ item ],
                value: TaskLevel[ item ],
            };
        });


    entity[ 'taskCommentTypes' ] = Object.keys(TaskCommentType).filter(a => Number(a))
        .map(item =>
        {
            return {
                id: Number(item),
                name: TaskCommentType[ item ],
                value: TaskCommentType[ item ],
            };
        });


    return entity;
}
