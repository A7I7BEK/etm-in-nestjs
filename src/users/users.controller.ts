import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { AttachRoleDto } from './dto/attach-role.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
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


    @Post('attachRole')
    @Permission(UserPermissions.AttachRole)
    async attachRole
        (
            @Body() attachRoleDto: AttachRoleDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.attachRole(attachRoleDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Post('change/language')
    async changeLanguage
        (
            @Body() changeLanguageDto: ChangeLanguageDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.changeLanguage(changeLanguageDto, activeUser);
        return modifyEntityForFront(entity);
    }
}
