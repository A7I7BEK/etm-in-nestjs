import { TaskAttachment } from '../entities/task-attachment.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskAttachmentForFront(entity: TaskAttachment)
{
    const { file } = entity;


    if (file)
    {
        const { id, ...rest } = file;
        Object.assign(entity, {
            fileId: id,
            ...rest
        });
    }


    return entity;
}