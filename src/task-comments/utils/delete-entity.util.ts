import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { TaskComment } from '../entities/task-comment.entity';
import { TaskCommentPermissions } from '../enums/task-comment-permissions.enum';
import { TaskCommentsService } from '../task-comments.service';


export async function deleteEntity
    (
        service: TaskCommentsService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                task: {
                    project: true,
                },
            }
        },
        activeUser,
    );
    await service.repository.remove(entity);


    wsEmitOneTask(
        service.tasksService,
        entity.task.id,
        activeUser,
        'replace',
    );


    const actionData: BaseSimpleEvent<TaskComment> = {
        entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskCommentPermissions.Delete ],
        actionData
    );


    return entity;
}
