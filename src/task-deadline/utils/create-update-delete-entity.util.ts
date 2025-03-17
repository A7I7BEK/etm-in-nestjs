import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskDeadlineCreateDto } from '../dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from '../dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from '../dto/task-deadline-update.dto';
import { TaskDeadline } from '../entities/task-deadline.entity';
import { TaskDeadlinePermissions } from '../enums/task-deadline-permissions.enum';
import { TaskDeadlineService } from '../task-deadline.service';


export async function createUpdateDeleteEntity
    (
        service: TaskDeadlineService,
        dto: TaskDeadlineCreateDto | TaskDeadlineUpdateDto | TaskDeadlineDeleteDto,
        activeUser: ActiveUserData,
    )
{
    const taskEntity = await service.tasksService.findOne(
        {
            where: {
                id: dto.taskId
            },
            relations: {
                project: true,
            }
        },
        activeUser
    );
    const oldTaskEntity = structuredClone(taskEntity);


    const entity = new TaskDeadline();
    entity.task = taskEntity;
    entity.details = dto;
    entity.createdAt = new Date();


    if (dto instanceof TaskDeadlineDeleteDto)
    {
        if (dto.startDate)
        {
            taskEntity.startDate = null;
        }
        if (dto.endDate)
        {
            taskEntity.endDate = null;
        }

        entity.action = TaskDeadlinePermissions.DELETE;
        entity.comment = dto.changesComment;
    }
    else if (dto instanceof TaskDeadlineUpdateDto)
    {
        taskEntity.startDate = dto.startDate;
        taskEntity.endDate = dto.endDate;

        entity.action = TaskDeadlinePermissions.UPDATE;
        entity.comment = dto.changesComment;
    }
    else
    {
        taskEntity.startDate = dto.startDate;
        taskEntity.endDate = dto.endDate;

        entity.action = TaskDeadlinePermissions.CREATE;
        entity.comment = '';
    }
    await service.tasksService.repository.save(taskEntity);
    await service.repository.save(entity);


    const actionData: BaseDiffEvent<Task> = {
        oldEntity: oldTaskEntity,
        newEntity: structuredClone(taskEntity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, entity.action ],
        actionData
    );


    return taskEntity;
}
