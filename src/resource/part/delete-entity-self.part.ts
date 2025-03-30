import * as fs from 'fs';
import { Resource } from '../entities/resource.entity';
import { ResourceService } from '../resource.service';


export async function deleteEntitySelfPart
    (
        service: ResourceService,
        entity: Resource,
    )
{
    try
    {
        await fs.promises.rm(entity.url);
    }
    catch (error)
    {
        console.log(`Failed to remove file: id-${entity.id}`, error);
    }


    return service.repository.remove(entity);
}
