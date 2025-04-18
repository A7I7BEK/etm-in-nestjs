import * as fs from 'fs';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResourceService } from '../resource.service';
import { generateFullPath } from '../utils/resource.utils';


export async function deleteEntityByIdPart
    (
        service: ResourceService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id }
        },
        activeUser,
    );


    try
    {
        await fs.promises.rm(generateFullPath(entity.url));
    }
    catch (error)
    {
        console.log(`Failed to remove file with id: ${id}`, error);
    }


    return service.resRepo.remove(entity);
}
