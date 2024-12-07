import { CheckListGroupPermissions } from 'src/check-list-groups/enums/check-list-group-permissions.enum';
import { EmployeePermissions } from 'src/employees/enums/employee-permissions.enum';
import { GroupPermissions } from 'src/groups/enums/group-permissions.enum';
import { OrganizationPermissions } from 'src/organizations/enums/organization-permissions.enum';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionPermissions } from 'src/permissions/enums/permission-permissions.enum';
import { ProjectColumnPermissions } from 'src/project-columns/enums/project-column-permissions.enum';
import { ProjectMemberPermissions } from 'src/project-members/enums/project-member-permissions.enum';
import { ProjectTagPermissions } from 'src/project-tags/enums/project-tag-permissions.enum';
import { ProjectPermissions } from 'src/projects/enums/project-permissions.enum';
import { ReportPermissions } from 'src/reports/enums/report-permissions.enum';
import { RolePermissions } from 'src/roles/enums/role-permissions.enum';
import { TaskCommentPermissions } from 'src/task-comments/enums/task-comment-permissions.enum';
import { TaskDeadlinePermissions } from 'src/task-deadline/enums/task-deadline-permissions.enum';
import { TaskMemberPermissions } from 'src/task-members/enums/task-member-permissions.enum';
import { TaskTagPermissions } from 'src/task-tags/enums/task-tag-permissions.enum';
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
    | ProjectColumnPermissions
    | ProjectMemberPermissions
    | ProjectTagPermissions
    | TaskPermissions
    | TaskMemberPermissions
    | TaskTagPermissions
    | TaskCommentPermissions
    | TaskDeadlinePermissions
    | CheckListGroupPermissions
    | ReportPermissions
);

export const PERMISSION_TYPE_KEY = 'PERMISSION_TYPE_KEY';

export const PERMISSION_VALUES = [
    ...Object.values(OrganizationPermissions),
    ...Object.values(PermissionPermissions),
    ...Object.values(RolePermissions),
    ...Object.values(UserPermissions),
    ...Object.values(EmployeePermissions),
    ...Object.values(GroupPermissions),
    ...Object.values(ProjectPermissions),
    ...Object.values(ProjectColumnPermissions),
    ...Object.values(ProjectMemberPermissions),
    ...Object.values(ProjectTagPermissions),
    ...Object.values(TaskPermissions),
    ...Object.values(TaskMemberPermissions),
    ...Object.values(TaskTagPermissions),
    ...Object.values(TaskCommentPermissions),
    ...Object.values(TaskDeadlinePermissions),
    ...Object.values(CheckListGroupPermissions),
    ...Object.values(ReportPermissions),
];

export const PERMISSION_LIST: Pick<Permission, 'name' | 'codeName'>[] =
    PERMISSION_VALUES.map(perm => ({
        name: perm,
        codeName: perm,
    }));
