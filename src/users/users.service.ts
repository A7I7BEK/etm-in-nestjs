import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { RolesService } from 'src/roles/roles.service';
import { FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { AttachRoleDto } from './dto/attach-role.dto';
import { ChangeLanguageDto } from './dto/change-language.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Language } from './language/language.enum';

@Injectable()
export class UsersService
{
    constructor (
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject(forwardRef(() => RolesService)) // BINGO
        private readonly rolesService: RolesService,
    ) { }

    create(createUserDto: CreateUserDto)
    {
        const entity = this.usersRepository.create({
            ...createUserDto
        });
        return this.usersRepository.save(entity);
    }

    findAll()
    {
        return this.usersRepository.find();
    }

    async findOne(where: FindOptionsWhere<User>, relations?: FindOptionsRelations<User>)
    {
        const entity = await this.usersRepository.findOne({ where, relations });

        if (!entity || entity.userName === appConfig().admin.username) // Don't show system admin
        {
            throw new NotFoundException(`${User.name} not found`);
        }

        return entity;
    }

    async update(id: number, updateUserDto: UpdateUserDto)
    {
        const entity = await this.findOne({ id });

        Object.assign(entity, updateUserDto);

        return this.usersRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.usersRepository.remove(entity);
    }

    async attachRole(attachRoleDto: AttachRoleDto)
    {
        const entity = await this.findOne({ id: attachRoleDto.userId });

        const roleIds = attachRoleDto.roles.map(x => x.id);
        const rolesFound = await this.rolesService.findAll({ where: { id: In(roleIds) } });
        entity.roles = rolesFound;

        return this.usersRepository.save(entity);
    }

    async changeLanguage(changeLanguageDto: ChangeLanguageDto, activeUser: ActiveUserData)
    {
        const entity = await this.findOne({ id: activeUser.sub });

        const languageName = Object.keys(Language).find(key => Language[ key ] === changeLanguageDto.langCode) as (keyof typeof Language);

        entity.language.code = changeLanguageDto.langCode;
        entity.language.name = languageName;

        return this.usersRepository.save(entity);
    }
}
