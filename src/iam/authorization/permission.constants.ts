import { EmployeesPermission } from 'src/employees/enums/employees-permission.enum';
import { OrganizationsPermission } from 'src/organizations/enums/organizations-permission.enum';
import { RolesPermission } from 'src/roles/enums/roles-permission.enum';


export type PermissionType = (
    EmployeesPermission
    | OrganizationsPermission
    | RolesPermission
);

export const PERMISSION_TYPE_KEY = 'PERMISSION_TYPE_KEY';

export const permissionList = [
    ...Object.values(EmployeesPermission),
    ...Object.values(OrganizationsPermission),
    ...Object.values(RolesPermission),
];
