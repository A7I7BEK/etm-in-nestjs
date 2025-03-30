import * as fs from 'fs';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Equal, FindOneOptions } from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { ResourceService } from '../resource.service';


export async function deleteEntityByUrlSilentPart
    (
        service: ResourceService,
        url: string,
        activeUser: ActiveUserData,
    )
{
    let options: FindOneOptions<Resource> = {
        where: {
            url: Equal(url)
        }
    };


    if (!activeUser.systemAdmin)
    {
        const orgOption: FindOneOptions<Resource> = {
            where: {
                organization: {
                    id: activeUser.orgId
                }
            }
        };

        setNestedOptions(options ??= {}, orgOption);
    }


    const entity = await service.repository.findOne(options);


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
}
