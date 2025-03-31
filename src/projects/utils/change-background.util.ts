import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
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


    if (dto.background.charAt(0) !== '#')
    {
        await service.resourceService
            .savePermanentByUrl(dto.background, activeUser);
    }


    if (
        entity.background
        && entity.background.charAt(0) !== '#'
        && entity.background !== dto.background
    )
    {
        await service.resourceService.removeByUrl(entity.background, activeUser);
    }


    entity.background = dto.background;
    await service.repository.save(entity);


    return entity;
}
