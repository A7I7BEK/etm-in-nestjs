import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCreateDto } from '../dto/task-create.dto';
import { Task } from '../entities/task.entity';
import { TasksService } from '../tasks.service';


export async function createEntity
    (
        service: TasksService,
        dto: TaskCreateDto,
        activeUser: ActiveUserData,
        entity = new Task(),
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
            }
        },
        activeUser,
    );


    entity.name = dto.name;
    entity.column = columnEntity;
    entity.project = columnEntity.project;
    entity.ordering = columnEntity.tasks.length;
    entity.createdAt = new Date();


    delete entity.column.project;
    delete entity.column.tasks;


    return service.repository.save(entity);
}
