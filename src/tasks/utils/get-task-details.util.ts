import { calculateCheckListGroupPercent } from 'src/check-list-groups/utils/calculate-check-list-group-percent.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from '../tasks.service';
import { calculateTaskStatus } from './calculate-task-status.util';


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
                        employees: {
                            user: true
                        }
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
            order: {
                checkListGroups: {
                    id: 'ASC',
                    checkList: {
                        id: 'ASC',
                    }
                },
            },
        },
        activeUser,
    );
    calculateTaskStatus(entity);
    entity.checkListGroups.forEach(group => calculateCheckListGroupPercent(group));


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
            employee: {
                user: true,
            },
            task: true,
            project: true,
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
            employees: {
                user: true
            }
        },
        order: {
            id: 'DESC'
        },
        take: 10,
    });
    entity.comments = commentList;
    entity[ 'commentsCount' ] = commentCount;


    return entity;
}
