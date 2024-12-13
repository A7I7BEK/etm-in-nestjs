import { ConflictException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskTagCreateDto } from '../dto/task-tag-create.dto';
import { TaskTag } from '../entities/task-tag.entity';
import { TaskTagsService } from '../task-tags.service';


export async function createEntity
    (
        service: TaskTagsService,
        dto: TaskTagCreateDto,
        activeUser: ActiveUserData,
    )
{
    const entityExists = await service.repository.exists({
        where: {
            task: {
                id: dto.taskId,
                project: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            },
            projectTag: {
                id: dto.projectTagId,
            },
        }
    });
    if (entityExists)
    {
        throw new ConflictException(`${TaskTag.name} already exists`);
    }


    const entity = new TaskTag();


    entity.task = await service.tasksService.findOne(
        {
            where: { id: dto.taskId }
        },
        activeUser,
    );


    entity.projectTag = await service.projectTagsService.findOne(
        {
            where: { id: dto.projectTagId }
        },
        activeUser,
    );


    return service.repository.save(entity);
}
