import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { Repository } from 'typeorm';
import { ProjectUpdateDto } from '../dto/project-update.dto';
import { Project } from '../entities/project.entity';


export async function updateEntity(
    organizationsService: OrganizationsService,
    employeesService: EmployeesService,
    groupsService: GroupsService,
    projectMembersService: ProjectMembersService,
    repository: Repository<Project>,
    dto: ProjectUpdateDto,
    activeUser: ActiveUserData,
    entity: Project,
)
{
    const organizationEntity = await organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
        },
        activeUser,
    );


    const managerEntity = await employeesService.findOne(
        {
            where: { id: dto.manager.id }
        },
        activeUser,
    );


    const groupEntity = await groupsService.findOne(
        {
            where: { id: dto.group.id },
            relations: { employees: true, leader: true }
        },
        activeUser,
    );


    const memberList = groupEntity.employees.map(item =>
    {
        const member = new ProjectMember();
        member.employee = item;
        member.isTeamLeader = item.id === groupEntity.leader.id;

        return member;
    });
    await projectMembersService.repository.save(memberList);


    if (entity.group.id !== groupEntity.id)
    {
        // TODO: remove old members
    }


    entity.name = dto.name;
    entity.codeName = dto.codeName;
    entity.organization = organizationEntity;
    entity.manager = managerEntity;
    entity.group = groupEntity;
    entity.members = memberList;


    return repository.save(entity);
}
