import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCommentType } from 'src/task-comments/enums/task-comment-type.enum';
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


    const [ actionList, actionCount ] = await service.actionsService.repository.findAndCount({
        where: {
            project: {
                id,
                organization: {
                    id: activeUser.orgId
                }
            }
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


    modifyProjectForFront(entity);


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
