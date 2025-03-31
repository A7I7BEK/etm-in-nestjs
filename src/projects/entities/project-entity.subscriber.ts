import { Injectable } from '@nestjs/common';
import { ResourceService } from 'src/resource/resource.service';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { Project } from './project.entity';


@EventSubscriber()
@Injectable()
export class ProjectEntitySubscriber implements EntitySubscriberInterface<Project>
{
    constructor (
        public readonly resourceService: ResourceService,
    ) { }


    listenTo()
    {
        return Project;
    }


    async beforeRemove(event: RemoveEvent<Project>)
    {
        const { entity } = event;

        console.log('ProjectEntitySubscriber', entity);

        if (entity && entity.background)
        {
            await this.resourceService.removeByUrlSilent(entity.background);
        }
    }
}