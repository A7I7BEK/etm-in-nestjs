import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskDeadlineAllDto } from '../dto/task-deadline-all.dto';
import { TaskDeadline } from '../entities/task-deadline.entity';
import { TaskDeadlineService } from '../task-deadline.service';


export async function createUpdateDeleteEntity
    (
        service: TaskDeadlineService,
        entity: TaskDeadline,
        dto: TaskDeadlineAllDto,
        activeUser: ActiveUserData,
    )
{
    const taskEntity = await service.tasksService.findOne(
        {
            where: {
                id: dto.taskId
            }
        },
        activeUser
    );


    taskEntity.startDate = dto.startDate;
    taskEntity.endDate = dto.endDate;
    await service.tasksService.repository.save(taskEntity);


    entity.task = taskEntity;
    await service.repository.save(entity);


    return service.tasksService.findOne(
        {
            where: {
                id: dto.taskId
            }
        },
        activeUser
    );
}
