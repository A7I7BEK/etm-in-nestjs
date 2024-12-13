import { ConflictException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskMemberCreateDto } from '../dto/task-member-create.dto';
import { TaskMember } from '../entities/task-member.entity';
import { TaskMembersService } from '../task-members.service';


export async function createEntity
    (
        service: TaskMembersService,
        dto: TaskMemberCreateDto,
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
            projectMember: {
                id: dto.projectMemberId,
            },
        }
    });
    if (entityExists)
    {
        throw new ConflictException(`${TaskMember.name} already exists`);
    }


    const entity = new TaskMember();


    entity.task = await service.tasksService.findOne(
        {
            where: { id: dto.taskId }
        },
        activeUser,
    );


    entity.projectMember = await service.projectMembersService.findOne(
        {
            where: { id: dto.projectMemberId }
        },
        activeUser,
    );


    return service.repository.save(entity);
}
