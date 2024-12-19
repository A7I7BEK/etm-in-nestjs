import { modifyProjectMemberForFront } from 'src/project-members/utils/modify-entity-for-front.util';
import { TaskMember } from '../entities/task-member.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskMemberForFront(entity: TaskMember)
{
    const { projectMember } = entity;


    if (projectMember)
    {
        entity.projectMember = modifyProjectMemberForFront(entity.projectMember);
        entity[ 'employee' ] = entity.projectMember.employee;
    }


    return entity;
}