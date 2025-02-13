import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { RolesService } from 'src/roles/roles.service';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { UserAttachRoleDto } from './dto/user-attach-role.dto';
import { UserChangeLanguageDto } from './dto/user-change-language.dto';
import { User } from './entities/user.entity';
import { Language } from './language/language.enum';

@Injectable()
export class UsersService
{
    constructor (
        @InjectRepository(User)
        public readonly repository: Repository<User>,
        private readonly _rolesService: RolesService,
    ) { }


    findAll
        (
            options: FindManyOptions<User>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<User> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        return this.repository.find(options);
    }


    async findOne
        (
            options: FindOneOptions<User>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<User> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${User.name} not found`);
        }

        return entity;
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );

        if (entity.id === activeUser.sub)
        {
            throw new ForbiddenException('Cannot delete yourself');
        }

        if (entity.marks.registered)
        {
            throw new ForbiddenException('Cannot delete ADMIN user');
        }

        return this.repository.remove(entity);
    }


    async attachRole
        (
            attachRoleDto: UserAttachRoleDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id: attachRoleDto.userId }
            },
            activeUser,
        );

        const roleIds = attachRoleDto.roles.map(x => x.id);
        const roleEntities = await this._rolesService.findAll(
            {
                where: { id: In(roleIds) }
            },
            activeUser,
        );
        entity.roles = roleEntities;

        return this.repository.save(entity);
    }


    async changeLanguage
        (
            changeLanguageDto: UserChangeLanguageDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id: activeUser.sub }
            },
            activeUser,
        );

        // BINGO
        const languageName = Object.keys(Language).find(key => Language[ key ] === changeLanguageDto.langCode) as (keyof typeof Language);

        entity.language.code = changeLanguageDto.langCode;
        entity.language.name = languageName;

        return this.repository.save(entity);
    }
}
