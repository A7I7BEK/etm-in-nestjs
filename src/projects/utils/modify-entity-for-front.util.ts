import { modifyProjectMemberForFront } from 'src/project-members/utils/modify-entity-for-front.util';
import { Project } from '../entities/project.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: Project)
{
    const { manager, organization, members } = entity;
    entity.members ??= [];


    Object.assign(entity, {
        projectType: {
            name: entity.projectType,
            value: entity.projectType,
        },
    });


    if (members)
    {
        entity.members = entity.members.map(item => modifyProjectMemberForFront(item));
    }


    if (manager)
    {
        Object.assign(entity, {
            managerName: `${manager.firstName} ${manager.lastName} ${manager.middleName}`,
        });
    }


    if (organization)
    {
        Object.assign(entity, {
            organizationId: organization.id,
            organizationName: organization.name,
        });
    }


    return entity;
}