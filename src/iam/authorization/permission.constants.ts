import { CheckListGroupsPermission } from 'src/check-list-groups/enums/check-list-groups-permission.enum';
import { EmployeesPermission } from 'src/employees/enums/employees-permission.enum';
import { GroupsPermission } from 'src/groups/enums/groups-permission.enum';
import { OrganizationsPermission } from 'src/organizations/enums/organizations-permission.enum';
import { PermissionsPermission } from 'src/permissions/enums/permissions-permission.enum';
import { ProjectsPermission } from 'src/projects/enums/projects-permission.enum';
import { ReportsPermission } from 'src/reports/enums/reports-permission.enum';
import { RolesPermission } from 'src/roles/enums/roles-permission.enum';
import { TasksPermission } from 'src/tasks/enums/tasks-permission.enum';
import { UsersPermission } from 'src/users/enums/users-permission.enum';


export type PermissionType = (
    OrganizationsPermission
    | PermissionsPermission
    | RolesPermission
    | UsersPermission
    | EmployeesPermission
    | GroupsPermission
    | ProjectsPermission
    | TasksPermission
    | CheckListGroupsPermission
    | ReportsPermission
);

export const PERMISSION_TYPE_KEY = 'PERMISSION_TYPE_KEY';

export const permissionList = [
    ...Object.values(OrganizationsPermission),
    ...Object.values(PermissionsPermission),
    ...Object.values(RolesPermission),
    ...Object.values(UsersPermission),
    ...Object.values(EmployeesPermission),
    ...Object.values(GroupsPermission),
    ...Object.values(ProjectsPermission),
    ...Object.values(TasksPermission),
    ...Object.values(CheckListGroupsPermission),
    ...Object.values(ReportsPermission),
];
