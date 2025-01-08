import { reOrderItems } from 'src/common/utils/re-order-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCreateDto } from '../dto/task-create.dto';
import { Task } from '../entities/task.entity';
import { TasksService } from '../tasks.service';
import { wsEmitOneTask } from './ws-emit-one-task.util';


export async function createEntity
    (
        service: TasksService,
        dto: TaskCreateDto,
        activeUser: ActiveUserData,
    )
{
    const columnEntity = await service.columnsService.findOne(
        {
            where: {
                id: dto.columnId,
                project: {
                    id: dto.projectId,
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


    const entity = new Task();
    entity.name = dto.name;
    entity.column = { ...columnEntity };
    delete entity.column.tasks;
    entity.project = columnEntity.project;
    entity.ordering = 0;
    entity.createdAt = new Date();
    await service.repository.save(entity);


    columnEntity.tasks.unshift(entity);
    reOrderItems(columnEntity.tasks);
    await service.repository.save(columnEntity.tasks);


    wsEmitOneTask(
        service,
        entity.id,
        entity.project.id,
        activeUser,
        'insert',
    );


    return entity;
}
