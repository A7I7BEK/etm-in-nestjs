import { Injectable } from '@nestjs/common';
import { ResourceService } from 'src/resource/resource.service';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { TaskAttachment } from './task-attachment.entity';


@EventSubscriber()
@Injectable()
export class TaskAttachmentEntitySubscriber implements EntitySubscriberInterface<TaskAttachment>
{
    constructor (
        public readonly resourceService: ResourceService,
    ) { }


    listenTo()
    {
        return TaskAttachment;
    }


    async beforeRemove(event: RemoveEvent<TaskAttachment>)
    {
        const { entity } = event;

        console.log('TaskAttachmentEntitySubscriber', entity);

        if (entity && entity.file)
        {
            await this.resourceService.removeSelf(entity.file);
        }
    }
}