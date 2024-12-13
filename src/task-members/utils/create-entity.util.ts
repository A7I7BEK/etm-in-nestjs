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
    const entity = new TaskMember();


    entity.task = await service._tasksService.findOne(
        {
            where: { id: dto.taskId }
        },
        activeUser,
    );


    entity.projectMember = await service._projectMembersService.findOne(
        {
            where: { id: dto.projectMemberId }
        },
        activeUser,
    );


    return service.repository.save(entity);
}
