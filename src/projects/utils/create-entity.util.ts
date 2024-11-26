import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { ProjectColumnTypeKanban } from 'src/project-columns/enums/project-column-type-kanban.enum';
import { ProjectColumnsService } from 'src/project-columns/project-columns.service';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { PROJECT_TAG_COLORS } from 'src/project-tags/constants/project-tag-colors.constant';
import { ProjectTag } from 'src/project-tags/entities/project-tag.entity';
import { ProjectTagsService } from 'src/project-tags/project-tags.service';
import { Repository } from 'typeorm';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { Project } from '../entities/project.entity';
import { ProjectType } from '../enums/project-type';


export async function createEntity(
    organizationsService: OrganizationsService,
    employeesService: EmployeesService,
    groupsService: GroupsService,
    projectMembersService: ProjectMembersService,
    projectColumnsService: ProjectColumnsService,
    projectTagsService: ProjectTagsService,
    repository: Repository<Project>,
    dto: ProjectCreateDto,
    activeUser: ActiveUserData,
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


    let columnList: ProjectColumn[];
    if (dto.projectType === ProjectType.KANBAN)
    {
        columnList = Object.values(ProjectColumnTypeKanban).map((item, index) =>
        {
            const column = new ProjectColumn();
            column.name = item;
            column.codeName = item;
            column.ordering = index;
            column.projectType = ProjectType.KANBAN;

            return column;
        });

        await projectColumnsService.repository.save(columnList);
    }


    const tagList = PROJECT_TAG_COLORS.map(item =>
    {
        const tag = new ProjectTag();
        Object.assign(tag, item);

        return tag;
    });
    await projectTagsService.repository.save(tagList);


    const entity = new Project();
    entity.name = dto.name;
    entity.codeName = dto.codeName;
    entity.projectType = dto.projectType;
    entity.organization = organizationEntity;
    entity.manager = managerEntity;
    entity.group = groupEntity;
    entity.members = memberList;
    entity.columns = columnList;
    entity.tags = tagList;


    return repository.save(entity);
}
