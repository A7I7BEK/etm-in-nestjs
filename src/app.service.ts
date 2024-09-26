import { ConflictException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import appConfig from './common/config/app.config';
import { Employee } from './employees/entities/employee.entity';
import { permissionList } from './iam/authorization/permission.constants';
import { HashingService } from './iam/hashing/hashing.service';
import { Organization } from './organizations/entities/organization.entity';
import { Permission } from './permissions/entities/permission.entity';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap
{
    constructor (
        @InjectRepository(Organization)
        private readonly organizationsRepository: Repository<Organization>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Employee)
        private readonly employeesRepository: Repository<Employee>,
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
        private readonly hashingService: HashingService,
    ) { }

    async onApplicationBootstrap()
    {
        await this.clearAndInsertPermissions();
        await this.createSystemAdmin();
    }

    async clearAndInsertPermissions()
    {
        try
        {
            const permissions = permissionList.map(perm => ({
                name: perm,
                codeName: perm,
            }));

            // await this.permissionsRepository.delete({}); // if deleted, roles crash
            await this.permissionsRepository
                .createQueryBuilder()
                .insert()
                .values(permissions)
                .orIgnore()
                .execute();
        }
        catch (error)
        {
            console.log('PERMISSION_CREATION --->', error);
        }
    }

    async createSystemAdmin()
    {
        try
        {
            const organizationFound = await this.organizationsRepository.findOneBy({ name: appConfig().admin.orgName });
            if (organizationFound)
            {
                const roleFound = await this.rolesRepository.findOneBy({
                    organization: {
                        id: organizationFound.id
                    }
                });
                roleFound.permissions = await this.permissionsRepository.find();
                await this.rolesRepository.save(roleFound);

                throw new ConflictException('System Admin already exists');
            }

            const organizationEntity = new Organization();
            organizationEntity.name = appConfig().admin.orgName;
            await this.organizationsRepository.save(organizationEntity);

            const roleEntity = new Role();
            roleEntity.roleName = appConfig().admin.roleName.toLocaleLowerCase();
            roleEntity.codeName = appConfig().admin.roleName;
            roleEntity.permissions = await this.permissionsRepository.find();
            roleEntity.organization = organizationEntity;
            await this.rolesRepository.save(roleEntity);

            const userEntity = new User();
            userEntity.systemAdmin = true;
            userEntity.active = true;
            userEntity.userName = appConfig().admin.username;
            userEntity.password = await this.hashingService.hash(appConfig().admin.password);
            userEntity.email = appConfig().admin.email;
            userEntity.phoneNumber = appConfig().admin.phoneNumber;
            userEntity.organization = organizationEntity;
            userEntity.roles = [ roleEntity ];
            await this.usersRepository.save(userEntity);

            const employeeEntity = new Employee();
            employeeEntity.firstName = appConfig().admin.firstName;
            employeeEntity.lastName = appConfig().admin.lastName;
            employeeEntity.user = userEntity;
            await this.employeesRepository.save(employeeEntity);
        }
        catch (error)
        {
            console.log('SYSTEM_ADMIN_CREATION --->', error.response.message);
        }
    }
}
