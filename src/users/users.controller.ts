import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { SYSTEM_ADMIN_DATA } from 'src/common/constants/system-admin-data.constant';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UserAttachRoleDto } from './dto/user-attach-role.dto';
import { UserChangeLanguageDto } from './dto/user-change-language.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { UserEmployeeUpdateDto } from './dto/user-employee-update.dto';
import { User } from './entities/user.entity';
import { UserPermissions } from './enums/user-permissions.enum';
import { UsersService } from './users.service';


@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController
{
    constructor (private readonly _service: UsersService) { }


    @Get('me')
    @Permission(UserPermissions.GET_ME)
    async getCurrentUser
        (
            @ActiveUser() activeUser: ActiveUserData
        )
    {
        if (activeUser.systemAdmin)
        {
            /**
             * BINGO: type cast SYSTEM_ADMIN_DATA to User
             * - Now, swagger will show the correct response type
             */
            return plainToInstance(User, SYSTEM_ADMIN_DATA);
        }

        const entity = await this._service.findOne(
            {
                where: { id: activeUser.sub },
                relations: {
                    employee: true,
                    organization: true,
                    roles: true,
                },
            },
            activeUser,
        );

        entity[ 'systemAdmin' ] = false;

        return entity;
    }


    @Post('attach-role')
    @Permission(UserPermissions.ATTACH_ROLE)
    attachRole
        (
            @Body() attachRoleDto: UserAttachRoleDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.attachRole(attachRoleDto, activeUser);
    }


    @Post('change-password')
    @Permission(UserPermissions.CHANGE_PASSWORD)
    passwordChange
        (
            @Body() changePasswordDto: UserChangePasswordDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.changePassword(changePasswordDto, activeUser);
    }


    @Post('change-language')
    @Permission(UserPermissions.CHANGE_LANGUAGE)
    changeLanguage
        (
            @Body() changeLanguageDto: UserChangeLanguageDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.changeLanguage(changeLanguageDto, activeUser);
    }


    @Post('update-profile')
    @Permission(UserPermissions.UPDATE_PROFILE)
    profileUpdate
        (
            @Body() updateDto: UserEmployeeUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.updateProfile(updateDto, activeUser);
    }
}
