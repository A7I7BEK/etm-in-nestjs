import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Equal } from 'typeorm';
import { ResourceStatus } from '../enums/resource-status.enum';
import { ResourceService } from '../resource.service';


export async function savePermanentByUrlPart
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


    entity.status = ResourceStatus.PERM;
    entity.updatedAt = new Date();


    return service.repository.save(entity);
}
