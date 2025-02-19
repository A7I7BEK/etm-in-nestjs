import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Equal } from 'typeorm';
import { ProjectBackgroundDto } from '../dto/project-background.dto';
import { ProjectsService } from '../projects.service';


export async function changeBackgroundUtil
    (
        service: ProjectsService,
        dto: ProjectBackgroundDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id: dto.projectId }
        },
        activeUser,
    );


    const oldBackground = entity.background;


    entity.background = dto.background;
    await service.repository.save(entity);


    const file = await service.resourceService.repository.findOneBy({
        url: Equal(oldBackground)
    });
    if (file)
    {
        await service.resourceService.remove(file.id, activeUser);
    }


    return entity;
}
