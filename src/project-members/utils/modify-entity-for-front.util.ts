import { ProjectMember } from '../entities/project-member.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyProjectMemberForFront(entity: ProjectMember)
{
    const { employee } = entity;
    const { user } = employee || {};


    if (employee)
    {
        Object.assign(entity.employee, {
            lastSeenTime: entity.lastSeenTime,
            isTeamLeader: entity.isTeamLeader,
        });
    }


    if (user)
    {
        delete entity.employee.user.password;

        Object.assign(entity.employee, {
            userId: user.id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
    }


    return entity;
}