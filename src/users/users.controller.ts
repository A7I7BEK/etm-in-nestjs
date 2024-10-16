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

        return this.returnModifiedEntity(entity, true, true);
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


    private returnModifiedEntity(entity: User, organization?: boolean, employee?: boolean)
    {
        const { organization: org, employee: emp, ...entityRest } = entity;
        const entityNew = { ...entityRest, ...{ userId: entity.id, systemAdmin: entity.marks.systemAdmin } };

        delete entityNew.password;
        delete entityNew.id;
        delete entityNew.marks;

        if (organization)
        {
            Object.assign(entityNew, {
                organizationId: org.id,
                organizationName: org.name,
            });
        }

        if (employee)
        {
            Object.assign(entityNew, {
                id: emp.id,
                firstName: emp.firstName,
                lastName: emp.lastName,
                middleName: emp.middleName,
                birthDate: emp.birthDate,
                photoUrl: emp.photoUrl,
            });
        }

        return entityNew;
    }
}
