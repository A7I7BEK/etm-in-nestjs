import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY, AuthType } from '../enums/auth-type.enum';

export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
