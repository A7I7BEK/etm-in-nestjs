import * as fs from 'fs';
import { Equal } from 'typeorm';
import { ResourceService } from '../resource.service';


export async function deleteEntityByUrlSilentPart
    (
        service: ResourceService,
        url: string,
    )
{
    const entity = await service.repository.findOne({
        where: {
            url: Equal(url)
        }
    });


    if (entity)
    {
        try
        {
            await fs.promises.rm(entity.url);
        }
        catch (error)
        {
            console.log(`Failed to remove file with url: ${url}`, error);
        }


        return service.repository.remove(entity);
    }
    else
    {
        console.log(`File not found with url: ${url}`);
        return null;
    }
}
