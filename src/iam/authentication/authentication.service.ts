import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import appConfig from 'src/common/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsPermission } from 'src/organizations/enums/organizations-permission.enum';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionsPermission } from 'src/permissions/enums/permissions-permission.enum';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { And, Equal, ILike, Not, Repository } from 'typeorm';
import { PermissionType } from '../authorization/permission.constants';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterConfirmDto } from './dto/register-confirm.dto';
import { RegisterDto } from './dto/register.dto';
import { OneTimePasswordService } from './one-time-password.service';
import { InvalidatedRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Injectable()
export class AuthenticationService
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
        private readonly jwtService: JwtService,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
        private readonly otpService: OneTimePasswordService,
    ) { }

    async register(registerDto: RegisterDto)
    {
        const organizationExists = await this.organizationsRepository.existsBy({ name: registerDto.organizationName });
        if (organizationExists)
        {
            throw new ConflictException('Organization already exists');
        }

        const usernameExists = await this.usersRepository.existsBy({ userName: registerDto.userName });
        if (usernameExists)
        {
            throw new ConflictException('Username already exists');
        }

        const emailExists = await this.usersRepository.existsBy({ email: registerDto.email });
        if (emailExists)
        {
            throw new ConflictException('Email already exists');
        }

        const phoneNumberExists = await this.usersRepository.existsBy({ phoneNumber: registerDto.phoneNumber });
        if (phoneNumberExists)
        {
            throw new ConflictException('Phone number already exists');
        }


        const [ organizationWord ] = OrganizationsPermission.Create.split('_');
        const adminPermissions = await this.permissionsRepository.findBy({
            name: Not(ILike(`${organizationWord}%`)),
            codeName: And(
                Not(Equal(PermissionsPermission.Create)),
                Not(Equal(PermissionsPermission.Update)),
                Not(Equal(PermissionsPermission.Delete)),
            ),
        });


        const organizationEntity = new Organization();
        organizationEntity.name = registerDto.organizationName;
        await this.organizationsRepository.save(organizationEntity);

        const roleEntity = new Role();
        roleEntity.roleName = appConfig().application.role.toLocaleLowerCase();
        roleEntity.codeName = appConfig().application.role;
        roleEntity.permissions = adminPermissions;
        roleEntity.organization = organizationEntity;
        await this.rolesRepository.save(roleEntity);

        const user = await this.usersRepository.save({
            userName: registerDto.userName,
            password: await this.hashingService.hash(registerDto.password),
            email: registerDto.email,
            phoneNumber: registerDto.phoneNumber,
            employee: await this.employeesRepository.save({
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
            }),
            organization: organizationEntity,
            roles: [ roleEntity ],
        });


        return this.otpService.send(user);
    }

    async registerResend(id: string)
    {
        await this.otpService.resend(id);
    }

    async registerConfirm(registerConfirmDto: RegisterConfirmDto)
    {
        const user = await this.otpService.confirmWithPassword(
            registerConfirmDto.createTryId,
            registerConfirmDto.otpCode,
            registerConfirmDto.password,
        );

        user.active = true;
        await this.usersRepository.save(user);

        return this.generateTokens(user);
    }


    async login(loginDto: LoginDto)
    {
        const error = new UnauthorizedException('Please, check your login credentials');

        const user = await this.usersRepository.findOne({
            where: {
                userName: loginDto.userName
            },
            relations: {
                roles: true
            },
        });
        if (!user)
        {
            throw error;
        }

        const isEqual = await this.hashingService.compare(loginDto.password, user.password);
        if (!isEqual)
        {
            throw error;
        }

        if (!user.active || !user.roles.length)
        {
            throw error;
        }

        return this.generateTokens(user);
    }

    async generateTokens(user: User)
    {
        const permissionCodeNames = [ ...new Set(user.roles.flatMap(role => role.permissions).map(perm => perm.codeName as PermissionType)) ];

        /**
         * Old Method
         */
        // const permissions = [ ...new Set(user.roles.reduce<Permission[]>((total, current) => [ ...total, ...current.permissions ], [])) ];
        // const permissionCodeNames = permissions.map(perm => perm.codeName);

        const refreshTokenId = randomUUID();

        const [ sessionToken, refreshToken ] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                appConfig().jwt.accessTokenSecret,
                appConfig().jwt.accessTokenTtl,
                {
                    email: user.email,
                    permissionCodeNames,
                }
            ),
            this.signToken(
                user.id,
                appConfig().jwt.refreshTokenSecret,
                appConfig().jwt.refreshTokenTtl,
                { refreshTokenId }
            ),
        ]);

        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

        return {
            sessionToken,
            refreshToken,
            expiresIn: appConfig().jwt.accessTokenTtl,
        };
    }

    private signToken<T>(userId: number, secret: string, expiresIn: number, payload?: T)
    {
        return this.jwtService.signAsync(
            {
                sub: userId,
                ...payload
            },
            {
                secret,
                expiresIn,
                audience: appConfig().jwt.audience,
                issuer: appConfig().jwt.issuer,
            }
        );
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto)
    {
        try
        {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'>
                & { refreshTokenId: string; }
            >
                (
                    refreshTokenDto.refreshToken,
                    {
                        secret: appConfig().jwt.refreshTokenSecret,
                        audience: appConfig().jwt.audience,
                        issuer: appConfig().jwt.issuer,
                    }
                );

            const user = await this.usersRepository.findOneOrFail({
                where: {
                    id: sub
                },
                relations: {
                    roles: true
                },
            });
            await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);
            await this.refreshTokenIdsStorage.remove(user.id);

            return this.generateTokens(user);
        }
        catch (error)
        {
            if (error instanceof InvalidatedRefreshTokenError)
            {
                // Take action: notify user that his refresh token might have been stolen
                throw new UnauthorizedException('Access denied');
            }

            throw new UnauthorizedException();
        }
    }
}
