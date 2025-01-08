import { reOrderItems } from 'src/common/utils/re-order-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from '../tasks.service';


export async function deleteEntity
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
                column: {
                    tasks: true
                }
            },
            order: {
                column: {
                    tasks: {
                        ordering: 'ASC',
                    }
                }
            }
        },
        activeUser,
    );


    const taskList = entity.column.tasks.filter(a => a.id !== entity.id);
    reOrderItems(taskList);
    await service.repository.save(taskList);
    await service.repository.remove(entity);


    entity.id = id;
    delete entity.column.tasks;
    service.tasksGateway.emitDelete(entity, entity.project.id);


    return entity;
}