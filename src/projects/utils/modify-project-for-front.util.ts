import { modifyProjectMemberForFront } from 'src/project-members/utils/modify-entity-for-front.util';
import { modifyTaskForProject } from 'src/tasks/utils/modify-task-for-project.util';
import { Project } from '../entities/project.entity';
import { calculateProjectPercent } from './calculate-project-percent.util';

/**
 * temporary for this project, must not exist
 */
export function modifyProjectForFront(entity: Project)
{
    Object.assign(entity, {
        organizationId: entity?.organization?.id,
        organizationName: entity?.organization?.name,
    });


    calculateProjectPercent(entity);


    entity.columns?.forEach(col =>
    {
        col.tasks?.forEach(task =>
        {
            modifyTaskForProject(task);
        });
    });


    entity.members?.forEach(item => modifyProjectMemberForFront(item));


    return entity;
}