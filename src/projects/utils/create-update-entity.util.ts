import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Project } from '../entities/project.entity';


export async function createUpdateEntity(
    organizationsService: OrganizationsService,
    groupsService: GroupsService,
    employeesService: EmployeesService,
    repository: Repository<Project>,
    dto: CreateProjectDto | UpdateProjectDto,
    activeUser: ActiveUserData,
    entity = new Project()
)
{
    let organizationEntity: Organization;
    if (activeUser.systemAdmin)
    {
        organizationEntity = await organizationsService.findOne({ id: dto.organizationId });
    }
    else
    {
        organizationEntity = await organizationsService.findOne({ id: activeUser.orgId });
    }

    const groupEntity = await groupsService.findOne(
        {
            id: dto.group.id,
            organization: {
                id: organizationEntity.id
            }
        },
        {
            employees: true,
            leader: true,
        }
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
            id: dto.manager.id,
            user: {
                organization: {
                    id: organizationEntity.id
                }
            }
        }
    );

    if (dto instanceof CreateProjectDto)
    {
        entity.projectType = dto.projectType;
    }
    else if (entity.group.id !== groupEntity.id)
    {
        // remove old members
    }


    entity.name = dto.name;
    entity.codeName = dto.codeName;
    entity.group = groupEntity;
    entity.members = memberList;
    entity.manager = managerEntity;
    entity.organization = organizationEntity;

    return repository.save(entity);
}
