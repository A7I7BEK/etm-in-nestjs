import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { ProjectColumnTypeKanban } from 'src/project-columns/enums/project-column-type-kanban.enum';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { PROJECT_TAG_COLORS } from 'src/project-tags/constants/project-tag-colors.constant';
import { ProjectTag } from 'src/project-tags/entities/project-tag.entity';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { Project } from '../entities/project.entity';
import { ProjectPermissions } from '../enums/project-permissions.enum';
import { ProjectType } from '../enums/project-type.enum';
import { ProjectsService } from '../projects.service';


export async function createEntity
    (
        service: ProjectsService,
        dto: ProjectCreateDto,
        activeUser: ActiveUserData,
    )
{
    const organizationEntity = await service.organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
        },
        activeUser,
    );


    const managerEntity = await service.employeesService.findOne(
        {
            where: { id: dto.managerId }
        },
        activeUser,
    );


    const groupEntity = await service.groupsService.findOne(
        {
            where: { id: dto.groupId },
            relations: { employees: true, leader: true }
        },
        activeUser,
    );


    if (!groupEntity.employees.find(a => a.id === managerEntity.id)) // BINGO: check if entity doesn't exist (recommended)
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
    await service.projectMembersService.repository.save(memberList);


    let columnList: ProjectColumn[];
    if (dto.projectType === ProjectType.KANBAN)
    {
        columnList = Object.values(ProjectColumnTypeKanban).map((item, index) =>
        {
            const column = new ProjectColumn();
            column.name = item;
            column.ordering = index;
            column.projectType = ProjectType.KANBAN;

            return column;
        });

        await service.projectColumnsService.repository.save(columnList);
    }


    const tagList = PROJECT_TAG_COLORS.map(item =>
    {
        const tag = new ProjectTag();
        Object.assign(tag, item);

        return tag;
    });
    await service.projectTagsService.repository.save(tagList);


    const entity = new Project();
    entity.name = dto.name;
    entity.projectType = dto.projectType;
    entity.organization = organizationEntity;
    entity.manager = managerEntity;
    entity.group = groupEntity;
    entity.members = memberList;
    entity.columns = columnList;
    entity.tags = tagList;
    await service.repository.save(entity);


    const actionData: BaseSimpleEvent<Project> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectPermissions.CREATE ],
        actionData
    );


    return entity;
}
