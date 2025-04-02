import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { ProjectUpdateDto } from '../dto/project-update.dto';
import { Project } from '../entities/project.entity';
import { ProjectPermissions } from '../enums/project-permissions.enum';
import { ProjectsService } from '../projects.service';


export async function updateEntity
    (
        service: ProjectsService,
        id: number,
        dto: ProjectUpdateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                members: true,
            },
        },
        activeUser,
    );
    const oldEntity = structuredClone(entity);
    delete oldEntity.members;


    const organizationEntity = await service.organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
        },
        activeUser,
    );


    const managerEntity = await service.employeesService.findOne(
        {
            where: { id: dto.managerId },
            relations: {
                user: true,
            },
        },
        activeUser,
    );


    const groupEntity = await service.groupsService.findOne(
        {
            where: { id: dto.groupId },
            relations: {
                employees: {
                    user: true,
                },
                leader: true,
            },
        },
        activeUser,
    );


    if (groupEntity.employees.every(a => a.id !== managerEntity.id)) // BINGO: check if entity doesn't exist (nice but not recommended)
    {
        groupEntity.employees.push(managerEntity);
    }
    const memberList = groupEntity.employees.map(item =>
    {
        const member = new ProjectMember();
        member.employee = item;
        member.isTeamLeader = item.id === groupEntity.leader.id;

        return member;
    });
    await service.projectMembersService.repository.remove(entity.members);
    await service.projectMembersService.repository.save(memberList);


    entity.name = dto.name;
    entity.organization = organizationEntity;
    entity.manager = managerEntity;
    entity.group = groupEntity;
    entity.members = memberList;
    await service.repository.save(entity);


    const actionData: BaseDiffEvent<Project> = {
        oldEntity,
        newEntity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectPermissions.UPDATE ],
        actionData
    );


    return entity;
}
