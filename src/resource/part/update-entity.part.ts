import * as path from 'path';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UpdateResourceDto } from '../dto/update-resource.dto';
import { ResourceService } from '../resource.service';


export async function updateEntityPart
    (
        service: ResourceService,
        id: number,
        dto: UpdateResourceDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id }
        },
        activeUser,
    );


    entity.name = dto.name + path.extname(entity.filename);
    entity.updatedAt = new Date();


    return service.repository.save(entity);
}
