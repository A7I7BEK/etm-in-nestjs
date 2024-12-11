import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectColumnsService } from 'src/project-columns/project-columns.service';
import { Repository } from 'typeorm';
import { TaskCreateDto } from '../dto/task-create.dto';
import { Task } from '../entities/task.entity';


export async function createEntity
    (
        columnsService: ProjectColumnsService,
        repository: Repository<Task>,
        dto: TaskCreateDto,
        activeUser: ActiveUserData,
        entity = new Task(),
    )
{
    const columnEntity = await columnsService.findOne(
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


    return repository.save(entity);
}
