import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { Repository } from 'typeorm';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { ProjectUpdateDto } from '../dto/project-update.dto';
import { Project } from '../entities/project.entity';


export async function createUpdateEntity(
    organizationsService: OrganizationsService,
    groupsService: GroupsService,
    employeesService: EmployeesService,
    repository: Repository<Project>,
    dto: ProjectCreateDto | ProjectUpdateDto,
    activeUser: ActiveUserData,
    entity = new Project()
)
{
    const organizationEntity = await organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
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


    const memberList = groupEntity.employees.map(empl =>
    {
        const entity = new ProjectMember();
        entity.employee = empl;
        entity.isTeamLeader = empl.id === groupEntity.leader.id;

        return entity;
    });


    const managerEntity = await employeesService.findOne(
        {
            where: { id: dto.manager.id }
        },
        activeUser,
    );


    if (dto instanceof ProjectCreateDto)
    {
        entity.projectType = dto.projectType;
    }
    else if (entity.group.id !== groupEntity.id)
    {
        // TODO: remove old members
    }


    entity.name = dto.name;
    entity.codeName = dto.codeName;
    entity.group = groupEntity;
    entity.members = memberList;
    entity.manager = managerEntity;
    entity.organization = organizationEntity;

    return repository.save(entity);
}
