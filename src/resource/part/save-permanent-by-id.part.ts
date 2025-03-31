import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResourceStatus } from '../enums/resource-status.enum';
import { ResourceService } from '../resource.service';


export async function savePermanentByIdPart
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


    entity.status = ResourceStatus.PERM;
    entity.updatedAt = new Date();


    return service.repository.save(entity);
}
