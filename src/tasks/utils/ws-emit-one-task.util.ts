import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from '../tasks.service';
import { modifyTaskForBoard } from './modify-task-for-board.util';


export async function wsEmitOneTask
    (
        service: TasksService,
        id: number,
        activeUser: ActiveUserData,
        action: 'insert' | 'replace',
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                project: true,
                column: true,
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
            },
            order: {
                comments: {
                    id: 'DESC'
                },
            },
        },
        activeUser,
    );


    modifyTaskForBoard(entity);


    if (action === 'insert')
    {
        service.tasksGateway.emitInsert(entity, entity.project.id);
    }
    else if (action === 'replace')
    {
        service.tasksGateway.emitReplace(entity, entity.project.id);
    }
}
