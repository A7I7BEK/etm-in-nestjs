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
                column: true,
            }
        },
        activeUser,
    );


    await service.repository.remove(entity);


    const columnEntity = await service.columnsService.findOne(
        {
            where: { id: entity.column.id },
            relations: { tasks: true },
            order: {
                tasks: {
                    ordering: 'ASC',
                }
            }
        },
        activeUser,
    );


    reOrderItems(columnEntity.tasks);
    await service.repository.save(columnEntity.tasks);


    entity.id = id;
    service.tasksGateway.emitDelete(entity, entity.project.id);


    return entity;
}
