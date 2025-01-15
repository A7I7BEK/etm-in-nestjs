import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectColumnCreateDto } from '../dto/project-column-create.dto';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnsService } from '../project-columns.service';
import { wsEmitOneColumn } from './ws-emit-one-column.util';


export async function createEntity
    (
        service: ProjectColumnsService,
        dto: ProjectColumnCreateDto,
        activeUser: ActiveUserData,
    )
{
    const projectEntity = await service.projectsService.findOne(
        {
            where: {
                id: dto.projectId
            },
            relations: {
                columns: true,
            },
            order: {
                columns: {
                    ordering: 'ASC',
                }
            }
        },
        activeUser,
    );


    const entity = new ProjectColumn();
    entity.name = dto.name;
    entity.codeName = dto.codeName;
    entity.ordering = projectEntity.columns.length;
    entity.project = { ...projectEntity };
    delete entity.project.columns;
    await service.repository.save(entity);


    wsEmitOneColumn(
        service,
        entity.id,
        activeUser,
        'insert',
    );


    return entity;
}
