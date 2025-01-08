import { reOrderItems } from 'src/common/utils/re-order-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskMoveDto } from '../dto/task-move.dto';
import { TasksService } from '../tasks.service';
import { wsEmitOneTask } from './ws-emit-one-task.util';


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


    if (
        entity.column.id === moveDto.columnId
        && entity.project.id === moveDto.projectId
    )
    {
        // same column
        const taskList = [ ...entity.column.tasks ];
        const task = taskList.find(a => a.id === entity.id);
        taskList.splice(taskList.indexOf(task), 1);
        taskList.splice(moveDto.ordering, 0, task);
        reOrderItems(taskList);
        await service.repository.save(taskList);


        delete entity.column.tasks;
        service.tasksGateway.emitReorder(entity, entity.project.id);


        return entity;
    }


    const columnEntity = await service.columnsService.findOne(
        {
            where: {
                id: moveDto.columnId,
                project: {
                    id: moveDto.projectId,
                }
            },
            relations: {
                project: true,
                tasks: true,
            },
            order: {
                tasks: {
                    ordering: 'ASC',
                }
            }
        },
        activeUser,
    );


    // old column
    const oldTaskList = entity.column.tasks.filter(a => a.id !== entity.id);
    reOrderItems(oldTaskList);
    await service.repository.save(oldTaskList);


    if (entity.project.id === moveDto.projectId)
    {
        // new column, same project
        entity[ 'oldColumnId' ] = entity.column.id;
        entity.column = { ...columnEntity };
        delete entity.column.tasks;
        columnEntity.tasks.splice(moveDto.ordering, 0, entity);
        reOrderItems(columnEntity.tasks);
        await service.repository.save(columnEntity.tasks);


        service.tasksGateway.emitMove(entity, entity.project.id);
    }
    else
    {
        // new column, new project
        const entityOld = structuredClone(entity); // BINGO

        entity.column = { ...columnEntity };
        delete entity.column.tasks;
        entity.project = columnEntity.project;
        columnEntity.tasks.splice(moveDto.ordering, 0, entity);
        reOrderItems(columnEntity.tasks);
        await service.repository.save(columnEntity.tasks);


        delete entityOld.column.tasks;
        service.tasksGateway.emitDelete(entityOld, entityOld.project.id); // delete from old project
        wsEmitOneTask(service, entity.id, entity.project.id, activeUser, 'insert'); // insert to new project
    }


    return entity;
}
