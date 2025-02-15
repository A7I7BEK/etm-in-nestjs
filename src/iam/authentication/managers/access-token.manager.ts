import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import appConfig from 'src/common/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { OneTimePasswordService } from 'src/one-time-password/one-time-password.service';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationPermissions } from 'src/organizations/enums/organization-permissions.enum';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionPermissions } from 'src/permissions/enums/permission-permissions.enum';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_REGISTER_CONFIRMED, USER_MARK_REGISTER_NEW } from 'src/users/marks/user-mark.constants';
import { And, Equal, ILike, Not, Repository } from 'typeorm';
import { PermissionType } from '../../authorization/permission.constants';
import { HashingService } from '../../hashing/hashing.service';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterConfirmDto } from '../dto/register-confirm.dto';
import { RegisterResendDto } from '../dto/register-resend.dto';
import { RegisterDto } from '../dto/register.dto';
import { InvalidatedRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Injectable()
export class AccessTokenManager
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
        private readonly oneTimePasswordService: OneTimePasswordService,
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


        const [ organizationWord ] = OrganizationPermissions.Create.split('_');
        const adminPermissions = await this.permissionsRepository.findBy({
            name: Not(ILike(`${organizationWord}%`)),
            codeName: And(
                Not(Equal(PermissionPermissions.Create)),
                Not(Equal(PermissionPermissions.Update)),
                Not(Equal(PermissionPermissions.Delete)),
            ),
        });


        const organizationEntity = new Organization();
        organizationEntity.name = registerDto.organizationName;
        await this.organizationsRepository.save(organizationEntity);

        const roleEntity = new Role();
        roleEntity.roleName = appConfig().default.role.toLowerCase();
        roleEntity.codeName = appConfig().default.role;
        roleEntity.systemCreated = true;
        roleEntity.permissions = adminPermissions;
        roleEntity.organization = organizationEntity;
        await this.rolesRepository.save(roleEntity);

        const user = await this.usersRepository.save({
            userName: registerDto.userName,
            password: await this.hashingService.hash(registerDto.password),
            email: registerDto.email,
            phoneNumber: registerDto.phoneNumber,
            marks: USER_MARK_REGISTER_NEW,
            employee: await this.employeesRepository.save({
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
            }),
            organization: organizationEntity,
            roles: [ roleEntity ],
        });

        const { otpId: id } = await this.oneTimePasswordService.send(user, { email: true, phone: true });

        return { id };
    }


    async registerResend(registerResendDto: RegisterResendDto)
    {
        await this.oneTimePasswordService.resend(registerResendDto.otpId);
    }


    async registerConfirm(registerConfirmDto: RegisterConfirmDto)
    {
        const user = await this.oneTimePasswordService.confirm(
            registerConfirmDto.createTryId,
            registerConfirmDto.otpCode,
        );

        user.marks = USER_MARK_REGISTER_CONFIRMED;
        await this.usersRepository.save(user);

        return this.login({ userName: user.userName, password: registerConfirmDto.password });
    }


    async login(loginDto: LoginDto)
    {
        const error = new UnauthorizedException('Please, check your login credentials');

        // System Admin check
        if (
            loginDto.userName === appConfig().admin.username
            && loginDto.password === appConfig().admin.password
        )
        {
            return this.generateTokens(0, 0, [], true);
        }

        const user = await this.usersRepository.findOne({
            where: {
                userName: loginDto.userName
            },
            relations: {
                roles: true,
                organization: true,
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


        if (!user.marks.active)
        {
            throw new UnauthorizedException('User is not active');
        }

        if (!user.roles.length)
        {
            throw new UnauthorizedException('User does not have a role');
        }

        return this.generateTokens(user.id, user.organization.id, user.roles);
    }


    async generateTokens(
        userId: number,
        organizationId: number,
        userRoles: Role[],
        systemAdmin = false,
    )
    {
        // BINGO
        const permissionCodeNames = [
            ...new Set(
                userRoles
                    .flatMap(role => role.permissions)
                    .map(perm => perm.codeName as PermissionType)
            )
        ];

        /**
         * Old Method
         */
        // const permissions = [ ...new Set(userRoles.reduce<Permission[]>((total, current) => [ ...total, ...current.permissions ], [])) ];
        // const permissionCodeNames = permissions.map(perm => perm.codeName);

        const refreshTokenId = randomUUID();
        await this.refreshTokenIdsStorage.insert(userId, refreshTokenId);

        const [ sessionToken, refreshToken ] = await Promise.all([
            this.signToken(
                appConfig().jwt.accessTokenSecret,
                appConfig().jwt.accessTokenTtl,
                {
                    sub: userId,
                    orgId: organizationId,
                    systemAdmin,
                    permissionCodeNames, // TODO: save into Redis
                }
            ),
            this.signToken(
                appConfig().jwt.refreshTokenSecret,
                appConfig().jwt.refreshTokenTtl,
                {
                    sub: userId,
                    refreshTokenId,
                }
            ),
        ]);


        return {
            sessionToken,
            refreshToken,
            expiresIn: appConfig().jwt.accessTokenTtl,
        };
    }


    private signToken<T extends Partial<ActiveUserData>>(secret: string, expiresIn: number, payload?: T)
    {
        return this.jwtService.signAsync(
            payload,
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
                    roles: true,
                    organization: true,
                },
            });
            await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);
            await this.refreshTokenIdsStorage.remove(user.id);

            return this.generateTokens(user.id, user.organization.id, user.roles);
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
