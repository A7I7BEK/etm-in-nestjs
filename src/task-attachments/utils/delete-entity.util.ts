import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskAttachmentDeleteDto } from '../dto/task-attachment-delete.dto';
import { TaskAttachment } from '../entities/task-attachment.entity';
import { TaskAttachmentPermissions } from '../enums/task-attachment-permissions.enum';
import { TaskAttachmentsService } from '../task-attachments.service';


export async function deleteEntity
    (
        service: TaskAttachmentsService,
        dto: TaskAttachmentDeleteDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: {
                task: {
                    id: dto.taskId,
                },
                file: {
                    id: dto.fileId,
                }
            },
            relations: {
                file: true,
                task: {
                    project: true,
                }
            }
        },
        activeUser,
    );


    await service.repository.remove(entity);
    await service.resourceService.removeSelf(entity.file);


    const actionData: BaseSimpleEvent<TaskAttachment> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskAttachmentPermissions.DELETE ],
        actionData
    );


    return entity;
}
