import { ProjectMember } from '../entities/project-member.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: ProjectMember)
{
    const { employee } = entity;
    const { user } = employee || {};


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


    Object.assign(entity.employee, {
        lastSeenTime: entity.lastSeenTime,
        isTeamLeader: entity.isTeamLeader,
    });


    return entity;
}