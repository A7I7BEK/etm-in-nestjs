import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from '../tasks.service';


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
                members: true,
            }
        },
        activeUser,
    );


    if (action === 'insert')
    {
        service.tasksGateway.emitInsert(entity, projectId);
    }
    else if (action === 'replace')
    {
        service.tasksGateway.emitReplace(entity, projectId);
    }
}
