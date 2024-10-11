export interface UserMark
{
    /**
     * The user is created during registration
     */
    registered: boolean;

    /**
     * The user is active
     */
    active: boolean;

    /**
     * The user is system admin
     */
    systemAdmin: boolean;
}