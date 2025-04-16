import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectBackgroundDto } from '../dto/project-background.dto';
import { Project } from '../entities/project.entity';
import { ProjectPermissions } from '../enums/project-permissions.enum';
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


    if (
        dto.background
        && dto.background.charAt(0) !== '#'
    )
    {
        // Just check
        await service.resourceService.findOne(
            {
                where: { url: dto.background }
            },
            activeUser,
        );
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


    if (
        entity.background
        && entity.background.charAt(0) !== '#'
    )
    {
        await service.resourceTrackerService.setAll(entity);
    }


    const actionData: BaseSimpleEvent<Project> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectPermissions.CHANGE_BACKGROUND ],
        actionData
    );


    return entity;
}
