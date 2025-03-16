import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { GroupsService } from '../groups.service';


export async function deleteEntityPart
    (
        service: GroupsService,
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


    return service.repository.remove(entity);
}
