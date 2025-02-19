import { User } from '../entities/user.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: User)
{
    const { employee, organization } = entity;


    entity[ 'userId' ] = entity.id;
    entity[ 'systemAdmin' ] = false;


    delete entity.password;
    delete entity.id;


    if (employee)
    {
        Object.assign(entity, {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            middleName: employee.middleName,
            birthDate: employee.birthDate,
            photoUrl: employee.photoUrl,
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