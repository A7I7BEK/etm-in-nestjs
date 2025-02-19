import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { EmployeeCreateDto } from 'src/employees/dto/employee-create.dto';
import { UserCreateDto } from './user-create.dto';

export class UserEmployeeUpdateDto extends OmitType(UserCreateDto, [ 'password', 'organizationId' ])
{
    @ValidateNested()
    @Type(() => EmployeeCreateDto)
    employee: EmployeeCreateDto;
}
