import { Injectable } from '@nestjs/common';
import { ResourceService } from 'src/resource/resource.service';
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { Employee } from './employee.entity';


@EventSubscriber()
@Injectable()
export class EmployeeEntitySubscriber implements EntitySubscriberInterface<Employee>
{
    constructor (
        public readonly resourceService: ResourceService,
    ) { }


    listenTo()
    {
        return Employee;
    }


    async beforeRemove(event: RemoveEvent<Employee>)
    {
        const { entity } = event;

        console.log('EmployeeEntitySubscriber', entity);

        if (entity && entity.photoFile)
        {
            await this.resourceService.removeSelf(entity.photoFile);
        }
    }
}