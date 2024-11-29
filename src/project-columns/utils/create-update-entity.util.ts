import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { Repository } from 'typeorm';
import { ProjectColumnCreateDto } from '../dto/project-column-create.dto';
import { ProjectColumnUpdateDto } from '../dto/project-column-update.dto';
import { ProjectColumn } from '../entities/project-column.entity';


export async function createUpdateEntity
    (
        projectsService: ProjectsService,
        repository: Repository<ProjectColumn>,
        dto: ProjectColumnCreateDto | ProjectColumnUpdateDto,
        activeUser: ActiveUserData,
        entity = new ProjectColumn(),
    )
{
    if (dto instanceof ProjectColumnCreateDto)
    {
        entity.project = await projectsService.findOne(
            {
                where: { id: dto.projectId },
                relations: { columns: true }
            },
            activeUser,
        );

        entity.ordering = entity.project.columns.length;
    }


    entity.name = dto.name;
    entity.codeName = dto.codeName;


    return repository.save(entity);
}
