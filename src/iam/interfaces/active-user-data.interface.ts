import { PermissionType } from '../authorization/permission.constants';

export interface ActiveUserData
{
    /**
     * The "subject" of the token. The value of this property is the user ID
     * that granted this token.
     */
    sub: number;

    /**
     * The subject's (user) organization.
     */
    orgId: number;

    /**
     * The user is system admin
     */
    systemAdmin: boolean;

    /**
     * The code names of permissions that are extracted from subject's (user) roles
     */
    permissionCodeNames: PermissionType[]; // TODO: save into Redis
}
