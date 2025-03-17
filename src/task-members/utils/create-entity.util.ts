import { ConflictException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { TaskMemberCreateDto } from '../dto/task-member-create.dto';
import { TaskMember } from '../entities/task-member.entity';
import { TaskMemberPermissions } from '../enums/task-member-permissions.enum';
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
            where: { id: dto.projectMemberId },
            relations: {
                project: true,
                employee: true,
            },
        },
        activeUser,
    );
    await service.repository.save(entity);


    const actionData: BaseSimpleEvent<TaskMember> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskMemberPermissions.CREATE ],
        actionData
    );


    wsEmitOneTask(
        service.tasksService,
        dto.taskId,
        activeUser,
        'replace',
    );


    return entity;
}
