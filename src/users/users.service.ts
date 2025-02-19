import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResourceService } from 'src/resource/resource.service';
import { RolesService } from 'src/roles/roles.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserAttachRoleDto } from './dto/user-attach-role.dto';
import { UserChangeLanguageDto } from './dto/user-change-language.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { UserCheckUniqueValueDto } from './dto/user-check-unique-value.dto';
import { UserEmployeeUpdateDto } from './dto/user-employee-update.dto';
import { User } from './entities/user.entity';
import { attachRoleUtil } from './utils/attach-role.util';
import { changeLanguageUtil } from './utils/change-language.util';
import { changePasswordUtil } from './utils/change-password.util';
import { checkUniqueValueUtil } from './utils/check-unique-value.util';
import { deleteEntityUtil } from './utils/delete-entity.util';
import { updateProfileUtil } from './utils/update-profile.util';

@Injectable()
export class UsersService
{
    constructor (
        @InjectRepository(User)
        public readonly repository: Repository<User>,
        @Inject(forwardRef(() => EmployeesService))
        public readonly employeesService: EmployeesService,
        public readonly rolesService: RolesService,
        public readonly resourceService: ResourceService,
        public readonly hashingService: HashingService,
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


    remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntityUtil(this, id, activeUser);
    }


    attachRole
        (
            dto: UserAttachRoleDto,
            activeUser: ActiveUserData,
        )
    {
        return attachRoleUtil(this, dto, activeUser);
    }


    changePassword
        (
            dto: UserChangePasswordDto,
            activeUser: ActiveUserData,
        )
    {
        return changePasswordUtil(this, dto, activeUser);
    }


    changeLanguage
        (
            dto: UserChangeLanguageDto,
            activeUser: ActiveUserData,
        )
    {
        return changeLanguageUtil(this, dto, activeUser);
    }


    updateProfile
        (
            dto: UserEmployeeUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        return updateProfileUtil(this, dto, activeUser);
    }


    checkUniqueValue
        (
            dto: UserCheckUniqueValueDto,
        )
    {
        return checkUniqueValueUtil(this, dto);
    }
}
