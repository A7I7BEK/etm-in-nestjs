import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from '../projects.service';


export async function deleteEntity
    (
        service: ProjectsService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
        },
        activeUser,
    );


    return service.repository.remove(entity);
}
