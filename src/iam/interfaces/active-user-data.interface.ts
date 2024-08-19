import { Role } from 'src/roles/entities/role.entity';

export interface ActiveUserData
{
    /**
     * The "subject" of the token. The value of this property is the user ID
     * that granted this token.
     */
    sub: number;

    /**
     * The subject's (user) email.
     */
    email: string;

    /**
     * The subject's (user) roles.
     */
    roles: Role[];
}
