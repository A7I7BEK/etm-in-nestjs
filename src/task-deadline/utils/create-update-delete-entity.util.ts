import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskDeadlineCreateDto } from '../dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from '../dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from '../dto/task-deadline-update.dto';
import { TaskDeadline } from '../entities/task-deadline.entity';
import { TaskDeadlineAction } from '../enums/task-deadline-action.enum';
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
    let deadlinePerm: TaskDeadlinePermissions;


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
        if (dto.deadLine)
        {
            taskEntity.endDate = null;
        }

        entity.action = TaskDeadlineAction.Delete;
        entity.comment = dto.changesComment;

        deadlinePerm = TaskDeadlinePermissions.Delete;
    }
    else if (dto instanceof TaskDeadlineUpdateDto)
    {
        taskEntity.startDate = dto.startDate;
        taskEntity.endDate = dto.deadLine;

        entity.action = TaskDeadlineAction.Update;
        entity.comment = dto.changesComment;

        deadlinePerm = TaskDeadlinePermissions.Update;
    }
    else
    {
        taskEntity.startDate = dto.startDate;
        taskEntity.endDate = dto.deadLine;

        entity.action = TaskDeadlineAction.Create;
        entity.comment = '';

        deadlinePerm = TaskDeadlinePermissions.Create;
    }
    await service.tasksService.repository.save(taskEntity);
    await service.repository.save(entity);


    const actionData: BaseDiffEvent<Task> = {
        oldEntity: oldTaskEntity,
        newEntity: taskEntity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, deadlinePerm ],
        actionData
    );


    return taskEntity;
}
