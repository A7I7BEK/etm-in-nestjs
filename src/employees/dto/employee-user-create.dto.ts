import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserCreateDto } from 'src/users/dto/user-create.dto';
import { EmployeeCreateDto } from './employee-create.dto';

export class EmployeeUserCreateDto extends EmployeeCreateDto
{
    @ValidateNested()
    @Type(() => UserCreateDto)
    user: UserCreateDto;
}
