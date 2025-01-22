import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { TaskTagDeleteDto } from '../dto/task-tag-delete.dto';
import { TaskTag } from '../entities/task-tag.entity';
import { TaskTagPermissions } from '../enums/task-tag-permissions.enum';
import { TaskTagsService } from '../task-tags.service';


export async function deleteEntity
    (
        service: TaskTagsService,
        dto: TaskTagDeleteDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: {
                task: {
                    id: dto.taskId,
                },
                projectTag: {
                    id: dto.projectTagId,
                },
            },
            relations: {
                task: true,
                projectTag: {
                    project: true,
                }
            }
        },
        activeUser,
    );
    await service.repository.remove(entity);


    wsEmitOneTask(
        service.tasksService,
        dto.taskId,
        activeUser,
        'replace',
    );


    const actionData: BaseSimpleEvent<TaskTag> = {
        entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskTagPermissions.Delete ],
        actionData
    );


    return entity;
}
