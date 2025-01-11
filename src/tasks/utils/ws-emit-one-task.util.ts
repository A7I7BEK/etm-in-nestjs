import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from '../tasks.service';
import { modifyTaskForProject } from './modify-task-for-project.util';


export async function wsEmitOneTask
    (
        service: TasksService,
        id: number,
        projectId: number,
        activeUser: ActiveUserData,
        action: 'insert' | 'replace',
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
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


    modifyTaskForProject(entity);


    if (action === 'insert')
    {
        service.tasksGateway.emitInsert(entity, projectId);
    }
    else if (action === 'replace')
    {
        service.tasksGateway.emitReplace(entity, projectId);
    }
}
