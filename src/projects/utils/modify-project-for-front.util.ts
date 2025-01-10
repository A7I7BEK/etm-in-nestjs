import { modifyProjectColumnForFront } from 'src/project-columns/utils/modify-entity-for-front.util';
import { modifyProjectMemberForFront } from 'src/project-members/utils/modify-entity-for-front.util';
import { modifyTaskForFront } from 'src/tasks/utils/modify-task-for-front.util';
import { Project } from '../entities/project.entity';
import { calculateProjectPercent } from './calculate-project-percent.util';

/**
 * temporary for this project, must not exist
 */
export function modifyProjectForFront(entity: Project)
{
    const { manager, organization } = entity;


    calculateProjectPercent(entity);


    Object.assign(entity, {
        projectType: {
            name: entity.projectType,
            value: entity.projectType,
        },
    });


    entity.columns?.forEach(col =>
    {
        modifyProjectColumnForFront(col);
        col.tasks?.forEach(task =>
        {
            modifyTaskForFront(task);
        });
    });


    entity.members?.forEach(item => modifyProjectMemberForFront(item));


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