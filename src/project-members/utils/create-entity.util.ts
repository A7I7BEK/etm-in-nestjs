import { Action } from 'src/actions/entities/action.entity';
import { ProjectMemberCreateEvent } from 'src/actions/event/project-member-create.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { In } from 'typeorm';
import { ProjectMemberCreateDto } from '../dto/project-member-create.dto';
import { ProjectMember } from '../entities/project-member.entity';
import { ProjectMemberPermissions } from '../enums/project-member-permissions.enum';
import { ProjectMembersService } from '../project-members.service';


export async function createEntity(
    service: ProjectMembersService,
    dto: ProjectMemberCreateDto,
    activeUser: ActiveUserData,
)
{
    const projectEntity = await service.projectsService.findOne(
        {
            where: { id: dto.projectId },
            relations: {
                members: {
                    employee: true,
                },
            }
        },
        activeUser,
    );


    const employeeIdsFiltered = dto.employeeIds.filter(
        id => projectEntity.members.every(a => a.employee.id !== id) // BINGO
    );
    const employeeEntities = await service.employeesService.findAll(
        {
            where: { id: In(employeeIdsFiltered) }
        },
        activeUser,
    );


    const entityList = employeeEntities.map(empl =>
    {
        const entity = new ProjectMember();
        entity.project = projectEntity;
        entity.employee = empl;

        return entity;
    });


    await service.repository.save(entityList);


    const actionData: ProjectMemberCreateEvent = {
        project: projectEntity,
        employees: employeeEntities,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectMemberPermissions.Create ],
        actionData
    );


    return entityList;
}
