import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { TaskMemberDeleteDto } from '../dto/task-member-delete.dto';
import { TaskMember } from '../entities/task-member.entity';
import { TaskMemberPermissions } from '../enums/task-member-permissions.enum';
import { TaskMembersService } from '../task-members.service';


export async function deleteEntity
    (
        service: TaskMembersService,
        dto: TaskMemberDeleteDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: {
                task: {
                    id: dto.taskId,
                },
                projectMember: {
                    id: dto.projectMemberId,
                }
            },
            relations: {
                task: true,
                projectMember: {
                    project: true,
                    employee: true,
                },
            },
        },
        activeUser,
    );
    await service.repository.remove(entity);


    const actionData: BaseSimpleEvent<TaskMember> = {
        entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskMemberPermissions.Delete ],
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
