import { Employee } from '../entities/employee.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: Employee) // BINGO
{
    const { user } = entity;
    const { organization, roles } = user || {};

    if (user)
    {
        delete entity.user.password;

        Object.assign(entity, {
            userId: user.id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            systemAdmin: false, // TODO: systemAdmin
        });
    }


    if (organization)
    {
        Object.assign(entity, {
            organizationId: organization.id,
            organizationName: organization.name,
        });
    }


    if (roles)
    {
        Object.assign(entity, {
            roles,
        });
    }


    return entity;
}