import * as fs from 'fs';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Equal } from 'typeorm';
import { ResourceService } from '../resource.service';
import { generateFullPath } from '../utils/resource.utils';


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
        await fs.promises.rm(generateFullPath(entity.url));
    }
    catch (error)
    {
        console.log(`Failed to remove file with url: ${url}`, error);
    }


    return service.resRepo.remove(entity);
}
