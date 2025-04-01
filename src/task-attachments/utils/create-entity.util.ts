import { ConflictException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskAttachmentCreateDto } from '../dto/task-attachment-create.dto';
import { TaskAttachment } from '../entities/task-attachment.entity';
import { TaskAttachmentPermissions } from '../enums/task-attachment-permissions.enum';
import { TaskAttachmentsService } from '../task-attachments.service';


export async function createEntity
    (
        service: TaskAttachmentsService,
        dto: TaskAttachmentCreateDto,
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
            file: {
                id: dto.fileId,
            },
        }
    });
    if (entityExists)
    {
        throw new ConflictException(`${TaskAttachment.name} already exists`);
    }


    const entity = new TaskAttachment();


    entity.task = await service.tasksService.findOne(
        {
            where: { id: dto.taskId },
            relations: {
                project: true,
            }
        },
        activeUser,
    );


    entity.file = await service.resourceService.findOne(
        {
            where: { id: dto.fileId }
        },
        activeUser,
    );
    await service.resourceTrackerService.setAll(entity);


    await service.repository.save(entity);


    const actionData: BaseSimpleEvent<TaskAttachment> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskAttachmentPermissions.CREATE ],
        actionData
    );


    return entity;
}
