import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Repository } from 'typeorm';
import { AttachRoleDto } from './dto/attach-role.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
import { User } from './entities/user.entity';
import { UsersPermission } from './enums/users-permission.enum';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController
{
    constructor (
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly usersService: UsersService,
    ) { }

    @Get('me')
    async getCurrentUser(@ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.usersRepository.findOne({
            where: { id: activeUser.sub },
            relations: { employee: true, organization: true, roles: true },
        });

        return this.returnModifiedEntity(entity);
    }

    @Post('attachRole')
    @Permission(UsersPermission.AttachRole)
    async attachRole(@Body() attachRoleDto: AttachRoleDto)
    {
        const entity = await this.usersService.attachRole(attachRoleDto);
        return this.returnModifiedEntity(entity);
    }

    @Post('change/language')
    async changeLanguage(@Body() changeLanguageDto: ChangeLanguageDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.usersService.changeLanguage(changeLanguageDto, activeUser);
        return this.returnModifiedEntity(entity);
    }


    private returnModifiedEntity(entity: User)
    {
        const { employee, organization } = entity;
        entity[ 'userId' ] = entity.id;
        entity[ 'systemAdmin' ] = entity.marks.systemAdmin;

        delete entity.password;
        delete entity.id;

        if (employee)
        {
            Object.assign(entity, {
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                middleName: employee.middleName,
                birthDate: employee.birthDate,
                photoUrl: employee.photoUrl,
            });
        }

        if (organization)
        {
            Object.assign(entity, {
                organizationId: organization.id,
                organizationName: organization.name,
            });
        }

        return entity;
    }
}
