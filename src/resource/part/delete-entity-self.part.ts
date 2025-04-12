import * as fs from 'fs';
import { Resource } from '../entities/resource.entity';
import { ResourceService } from '../resource.service';
import { generateFullPath } from '../utils/resource.utils';


export async function deleteEntitySelfPart
    (
        service: ResourceService,
        entity: Resource,
    )
{
    try
    {
        await fs.promises.rm(generateFullPath(entity.url));
    }
    catch (error)
    {
        console.log(`Failed to remove file: id-${entity.id}`, error);
    }


    return service.resRepo.remove(entity);
}
