import * as fs from 'fs';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Equal } from 'typeorm';
import { ResourceService } from '../resource.service';


export async function deleteEntityByUrlPart
    (
        service: ResourceService,
        url: string,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: {
                url: Equal(url)
            }
        },
        activeUser,
    );


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
