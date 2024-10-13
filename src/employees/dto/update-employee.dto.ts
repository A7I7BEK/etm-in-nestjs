import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateEmployeeDto } from './create-employee.dto';

// BINGO
export class UpdateEmployeeDto extends PartialType(OmitType(CreateEmployeeDto, [ 'user' ]))
{
    @ValidateNested()
    @Type(() => UpdateUserDto)
    user: UpdateUserDto;
}
