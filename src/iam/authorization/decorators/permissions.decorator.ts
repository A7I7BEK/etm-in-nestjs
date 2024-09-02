import { SetMetadata } from '@nestjs/common';
import { PERMISSION_TYPE_KEY, PermissionType } from '../permission.constants';

export const Permissions = (...permissions: PermissionType[]) => SetMetadata(PERMISSION_TYPE_KEY, permissions);
