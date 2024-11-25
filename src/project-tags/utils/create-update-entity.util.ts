import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { Repository } from 'typeorm';
import { ProjectTagCreateDto } from '../dto/project-tag-create.dto';
import { ProjectTagUpdateDto } from '../dto/project-tag-update.dto';
import { ProjectTag } from '../entities/project-tag.entity';


export async function createUpdateEntity
    (
        projectsService: ProjectsService,
        repository: Repository<ProjectTag>,
        dto: ProjectTagCreateDto | ProjectTagUpdateDto,
        activeUser: ActiveUserData,
        entity = new ProjectTag(),
    )
{
    if (dto instanceof ProjectTagCreateDto)
    {
        entity.project = await projectsService.findOne(
            {
                where: { id: dto.projectId }
            },
            activeUser,
        );
    }


    entity.name = dto.name;
    entity.color = dto.color;


    return repository.save(entity);
}
