import { reOrderItems } from 'src/common/utils/re-order-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskMoveDto } from '../dto/task-move.dto';
import { TasksService } from '../tasks.service';


export async function moveEntity
    (
        service: TasksService,
        moveDto: TaskMoveDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id: moveDto.id },
            relations: {
                column: {
                    tasks: true
                }
            }
        },
        activeUser,
    );


    const columnEntity = await service.columnsService.findOne(
        {
            where: {
                id: moveDto.columnId,
                project: {
                    id: moveDto.projectId,
                }
            },
            relations: { tasks: true },
            order: {
                tasks: {
                    ordering: 'ASC',
                }
            }
        },
        activeUser,
    );


    const task = columnEntity.tasks.find(a => a.id === entity.id);
    if (task)
    {
        // existing column
        columnEntity.tasks.splice(columnEntity.tasks.indexOf(task), 1);
        columnEntity.tasks.splice(moveDto.ordering, 0, task);
    }
    else
    {
        // old column
        const oldColumn = entity.column;
        oldColumn.tasks.splice(oldColumn.tasks.findIndex(a => a.id === entity.id), 1);
        reOrderItems(oldColumn.tasks);
        await service.repository.save(oldColumn.tasks);


        // new column
        entity.column = { ...columnEntity };
        delete entity.column.tasks;
        columnEntity.tasks.splice(moveDto.ordering, 0, entity);
    }


    reOrderItems(columnEntity.tasks);
    await service.repository.save(columnEntity.tasks);


    return task ? task : entity;
}
