import { ProjectMember } from '../entities/project-member.entity';

/**
 * temporary for this project, must not exist
 */
export function returnModifiedEntity(entity: ProjectMember)
{
    Object.assign(entity.employee, {
        lastSeenTime: entity.lastSeenTime,
        isTeamLeader: entity.isTeamLeader,
    });

    return entity;
}