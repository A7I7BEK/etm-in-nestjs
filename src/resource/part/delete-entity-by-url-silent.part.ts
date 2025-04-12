import * as fs from 'fs';
import { Equal } from 'typeorm';
import { ResourceService } from '../resource.service';
import { generateFullPath } from '../utils/resource.utils';


export async function deleteEntityByUrlSilentPart
    (
        service: ResourceService,
        url: string,
    )
{
    const entity = await service.resRepo.findOne({
        where: {
            url: Equal(url)
        }
    });


    if (entity)
    {
        try
        {
            await fs.promises.rm(generateFullPath(entity.url));
        }
        catch (error)
        {
            console.log(`Failed to remove file with url: ${url}`, error);
        }


        return service.resRepo.remove(entity);
    }
    else
    {
        console.log(`File not found with url: ${url}`);
        return null;
    }
}
