import { ConflictException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { TaskTagCreateDto } from '../dto/task-tag-create.dto';
import { TaskTag } from '../entities/task-tag.entity';
import { TaskTagPermissions } from '../enums/task-tag-permissions.enum';
import { TaskTagsService } from '../task-tags.service';


export async function createEntity
    (
        service: TaskTagsService,
        dto: TaskTagCreateDto,
        activeUser: ActiveUserData,
    )
{
    const entityExists = await service.repository.exists({
        where: {
            task: {
                id: dto.taskId,
                project: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            },
            projectTag: {
                id: dto.projectTagId,
            },
        }
    });
    if (entityExists)
    {
        throw new ConflictException(`${TaskTag.name} already exists`);
    }


    const entity = new TaskTag();
    entity.task = await service.tasksService.findOne(
        {
            where: { id: dto.taskId },
            relations: { project: true },
        },
        activeUser,
    );
    entity.projectTag = await service.projectTagsService.findOne(
        {
            where: { id: dto.projectTagId },
        },
        activeUser,
    );
    await service.repository.save(entity);


    const actionData: BaseSimpleEvent<TaskTag> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskTagPermissions.CREATE ],
        actionData
    );


    wsEmitOneTask(
        service.tasksService,
        entity.task.id,
        activeUser,
        'replace',
    );


    return entity;
}
