import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SYSTEM_ADMIN_DATA } from 'src/common/constants/system-admin-data.constant';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UserAttachRoleDto } from './dto/user-attach-role.dto';
import { UserChangeLanguageDto } from './dto/user-change-language.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { UserEmployeeUpdateDto } from './dto/user-employee-update.dto';
import { UserPermissions } from './enums/user-permissions.enum';
import { UsersService } from './users.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('users')
@Controller('users')
export class UsersController
{
    constructor (private readonly _service: UsersService) { }


    @Get('me')
    async getCurrentUser
        (
            @ActiveUser() activeUser: ActiveUserData
        )
    {
        if (activeUser.systemAdmin)
        {
            return SYSTEM_ADMIN_DATA;
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
        return modifyEntityForFront(entity);
    }


    @Post('attach-role')
    @Permission(UserPermissions.AttachRole)
    async attachRole
        (
            @Body() attachRoleDto: UserAttachRoleDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.attachRole(attachRoleDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Post('change-password')
    @Permission(UserPermissions.ChangePassword)
    async passwordChange
        (
            @Body() changePasswordDto: UserChangePasswordDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.changePassword(changePasswordDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Post('change-language')
    @Permission(UserPermissions.ChangeLanguage)
    async changeLanguage
        (
            @Body() changeLanguageDto: UserChangeLanguageDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.changeLanguage(changeLanguageDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Post('update-profile')
    @Permission(UserPermissions.UpdateProfile)
    async profileUpdate
        (
            @Body() updateDto: UserEmployeeUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.updateProfile(updateDto, activeUser);
        return modifyEntityForFront(entity);
    }
}
