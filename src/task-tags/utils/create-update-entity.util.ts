import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectTagsService } from 'src/project-tags/project-tags.service';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { TaskTagCreateDto } from '../dto/task-tag-create.dto';
import { TaskTag } from '../entities/task-tag.entity';


export async function createUpdateEntity
    (
        tasksService: TasksService,
        projectTagsService: ProjectTagsService,
        repository: Repository<TaskTag>,
        dto: TaskTagCreateDto,
        activeUser: ActiveUserData,
        entity = new TaskTag(),
    )
{
    entity.task = await tasksService.findOne(
        {
            where: { id: dto.taskId }
        },
        activeUser,
    );


    entity.projectTag = await projectTagsService.findOne(
        {
            where: { id: dto.projectTagId }
        },
        activeUser,
    );


    return repository.save(entity);
}
