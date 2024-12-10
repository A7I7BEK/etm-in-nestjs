import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListGroupsService } from '../check-list-groups.service';
import { CheckListGroupCreateDto } from '../dto/check-list-group-create.dto';
import { CheckListGroupUpdateDto } from '../dto/check-list-group-update.dto';
import { CheckListGroup } from '../entities/check-list-group.entity';


export async function createUpdateEntity
    (
        service: CheckListGroupsService,
        dto: CheckListGroupCreateDto | CheckListGroupUpdateDto,
        activeUser: ActiveUserData,
        entity = new CheckListGroup(),
    )
{
    if (dto instanceof CheckListGroupCreateDto)
    {
        entity.task = await service.tasksService.findOne(
            {
                where: { id: dto.taskId }
            },
            activeUser,
        );
    }


    entity.name = dto.name;


    return service.repository.save(entity);
}
