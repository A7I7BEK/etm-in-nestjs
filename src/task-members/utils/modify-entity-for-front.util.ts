import { TaskMember } from '../entities/task-member.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskMember)
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


    return entity;
}