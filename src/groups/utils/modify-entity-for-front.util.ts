import { Group } from '../entities/group.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: Group)
{
    const { employees, leader, organization } = entity;
    entity[ 'employeeGroups' ] = [];


    if (employees && leader)
    {
        entity[ 'employeeGroups' ] = employees.map(item => ({
            employeeId: item.id,
            employeeInfo: {
                firstName: item.firstName,
                lastName: item.lastName,
                middleName: item.lastName,
                birthDate: item.birthDate,
                photoUrl: item.photoUrl,
            },
            leader: item.id === leader.id,
        }));
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