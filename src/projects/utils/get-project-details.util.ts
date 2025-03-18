import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCommentType } from 'src/task-comments/enums/task-comment-type.enum';
import { TaskLevel } from 'src/tasks/enums/task-level.enum';
import { TaskPriority } from 'src/tasks/enums/task-priority.enum';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';
import { modifyTaskForBoard } from 'src/tasks/utils/modify-task-for-board.util';
import { ProjectsService } from '../projects.service';


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


    entity.columns.forEach(column =>
    {
        column.tasks.forEach(task => modifyTaskForBoard(task));
    });


    entity[ 'taskStatusTypes' ] = Object.values(TaskStatus).filter(a => typeof a === 'string');
    entity[ 'taskPriorityTypes' ] = Object.values(TaskPriority);
    entity[ 'taskLevelTypes' ] = Object.values(TaskLevel);
    entity[ 'taskCommentTypes' ] = Object.values(TaskCommentType);


    return entity;
}
