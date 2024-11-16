import { OmitType } from '@nestjs/swagger';
import { UserCreateDto } from './user-create.dto';

export class UserUpdateDto extends OmitType(UserCreateDto, [ 'password' ]) { }
