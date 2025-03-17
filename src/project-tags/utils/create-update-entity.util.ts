import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectTagCreateDto } from '../dto/project-tag-create.dto';
import { ProjectTagUpdateDto } from '../dto/project-tag-update.dto';
import { ProjectTag } from '../entities/project-tag.entity';
import { ProjectTagPermissions } from '../enums/project-tag-permissions.enum';
import { ProjectTagsService } from '../project-tags.service';


export async function createUpdateEntity
    (
        service: ProjectTagsService,
        dto: ProjectTagCreateDto | ProjectTagUpdateDto,
        activeUser: ActiveUserData,
        id = 0,
    )
{
    let entity = new ProjectTag();
    let oldEntity: ProjectTag;


    if (dto instanceof ProjectTagCreateDto)
    {
        entity.project = await service.projectsService.findOne(
            {
                where: { id: dto.projectId }
            },
            activeUser,
        );
    }
    else
    {
        entity = await service.findOne(
            {
                where: { id },
                relations: {
                    project: true,
                }
            },
            activeUser,
        );
        oldEntity = structuredClone(entity);
    }


    entity.name = dto.name;
    entity.color = dto.color;
    await service.repository.save(entity);


    if (dto instanceof ProjectTagCreateDto)
    {
        const actionData: BaseSimpleEvent<ProjectTag> = {
            entity: structuredClone(entity),
            activeUser,
        };
        service.eventEmitter.emit(
            [ Action.name, ProjectTagPermissions.CREATE ],
            actionData
        );
    }
    else
    {
        const actionData: BaseDiffEvent<ProjectTag> = {
            oldEntity,
            newEntity: structuredClone(entity),
            activeUser,
        };
        service.eventEmitter.emit(
            [ Action.name, ProjectTagPermissions.UPDATE ],
            actionData
        );
    }


    return entity;
}
