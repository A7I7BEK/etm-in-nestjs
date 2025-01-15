import { ForbiddenException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { ProjectColumnUpdateDto } from '../dto/project-column-update.dto';
import { ProjectColumnsService } from '../project-columns.service';
import { wsEmitOneColumn } from './ws-emit-one-column.util';


export async function updateEntity
    (
        service: ProjectColumnsService,
        id: number,
        dto: ProjectColumnUpdateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
        },
        activeUser,
    );


    if (entity.projectType === ProjectType.KANBAN)
    {
        throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be edited`);
    }


    entity.name = dto.name;
    entity.codeName = dto.codeName;
    await service.repository.save(entity);


    wsEmitOneColumn(
        service,
        entity.id,
        activeUser,
        'replace',
    );


    return entity;
}
