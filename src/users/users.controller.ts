import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController
{
    constructor (private readonly usersService: UsersService) { }

    @Get()
    create(@ActiveUser() user: ActiveUserData)
    {
        return user;
    }


    @Get('users/me')
    getCurrentUser(@ActiveUser() user: ActiveUserData)
    {
        return this.usersService.findOne(user.sub);
    }

    @Patch('users/attachRole')
    attachRole(@Body() updateUserDto: UpdateUserDto)
    {
        return this.usersService.create(updateUserDto);
    }
}
