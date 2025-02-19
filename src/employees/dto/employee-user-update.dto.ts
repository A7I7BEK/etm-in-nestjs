import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserUpdateDto } from 'src/users/dto/user-update.dto';
import { EmployeeCreateDto } from './employee-create.dto';

// BINGO
// export class EmployeeUpdateDto extends PartialType(OmitType(EmployeeCreateDto, [ 'user' ]))
// export class EmployeeUpdateDto extends OmitType(EmployeeUserCreateDto, [ 'user' ])
export class EmployeeUserUpdateDto extends EmployeeCreateDto
{
    @ValidateNested()
    @Type(() => UserUpdateDto)
    user: UserUpdateDto;
}
