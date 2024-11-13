import { CheckListGroupPermissions } from 'src/check-list-groups/enums/check-list-group-permissions.enum';
import { EmployeePermissions } from 'src/employees/enums/employee-permissions.enum';
import { GroupPermissions } from 'src/groups/enums/group-permissions.enum';
import { OrganizationPermissions } from 'src/organizations/enums/organization-permissions.enum';
import { PermissionPermissions } from 'src/permissions/enums/permission-permissions.enum';
import { ProjectMemberPermissions } from 'src/project-members/enums/project-member-permissions.enum';
import { ProjectPermissions } from 'src/projects/enums/project-permissions.enum';
import { ReportPermissions } from 'src/reports/enums/report-permissions.enum';
import { RolePermissions } from 'src/roles/enums/role-permissions.enum';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';
import { UserPermissions } from 'src/users/enums/user-permissions.enum';


export type PermissionType = (
    | OrganizationPermissions
    | PermissionPermissions
    | RolePermissions
    | UserPermissions
    | EmployeePermissions
    | GroupPermissions
    | ProjectPermissions
    | ProjectMemberPermissions
    | TaskPermissions
    | CheckListGroupPermissions
    | ReportPermissions
);

export const PERMISSION_TYPE_KEY = 'PERMISSION_TYPE_KEY';

export const permissionList = [
    ...Object.values(OrganizationPermissions),
    ...Object.values(PermissionPermissions),
    ...Object.values(RolePermissions),
    ...Object.values(UserPermissions),
    ...Object.values(EmployeePermissions),
    ...Object.values(GroupPermissions),
    ...Object.values(ProjectPermissions),
    ...Object.values(ProjectMemberPermissions),
    ...Object.values(TaskPermissions),
    ...Object.values(CheckListGroupPermissions),
    ...Object.values(ReportPermissions),
];
