import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { AttachRoleDto } from './dto/attach-role.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
import { User } from './entities/user.entity';
import { UsersPermission } from './enums/users-permission.enum';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController
{
    constructor (private readonly usersService: UsersService) { }

    @Get('me')
    getCurrentUser(@ActiveUser() user: ActiveUserData)
    {
        return {
            user,
            dbUser: this.usersService.findOne({ id: user.sub })
        };
    }

    @Post('attachRole')
    @Permission(UsersPermission.AttachRole)
    async attachRole(@Body() attachRoleDto: AttachRoleDto)
    {
        const user = await this.usersService.attachRole(attachRoleDto);
        return this.returnModifiedUser(user, false, true);
    }

    @Post('change/language')
    async changeLanguage(@Body() changeLanguageDto: ChangeLanguageDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const user = await this.usersService.changeLanguage(changeLanguageDto, activeUser);
        return this.returnModifiedUser(user);
    }


    private returnModifiedUser(user: User, organization?: boolean, roles?: boolean) // BINGO
    {
        delete user.password;

        if (organization)
        {
            Object.assign(user, {
                organizationId: user.organization.id,
            });
        }

        if (roles)
        {
            Object.assign(user, {
                roles: user.roles,
            });
        }

        return user;
    }
}
