import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import appConfig from 'src/common/config/app.config';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';
import { OneTimePasswordService } from 'src/one-time-password/one-time-password.service';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Role } from 'src/roles/entity/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_REGISTER_CONFIRMED, USER_MARK_REGISTER_NEW } from 'src/users/marks/user-mark.constants';
import { UsersService } from 'src/users/users.service';
import { Equal } from 'typeorm';
import { PermissionType } from '../../authorization/permission.constants';
import { HashingService } from '../../hashing/hashing.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterConfirmDto } from '../dto/register-confirm.dto';
import { RegisterResendDto } from '../dto/register-resend.dto';
import { RegisterDto } from '../dto/register.dto';
import { AccessTokenPermissionStorage } from '../storage/access-token-permission.storage';
import { InvalidatedRefreshTokenError, RefreshTokenIdStorage } from '../storage/refresh-token-id.storage';


@Injectable()
export class AccessTokenManager
{
    constructor (
        public readonly usersService: UsersService,
        public readonly employeesService: EmployeesService,
        public readonly rolesService: RolesService,
        public readonly permissionsService: PermissionsService,
        public readonly organizationsService: OrganizationsService,
        public readonly oneTimePasswordService: OneTimePasswordService,
        public readonly hashingService: HashingService,
        public readonly jwtCustomService: JwtCustomService,
        public readonly accTokenPermStorage: AccessTokenPermissionStorage,
        public readonly refTokenIdStorage: RefreshTokenIdStorage,
    ) { }


    async register(registerDto: RegisterDto)
    {
        const orgExists = await this.organizationsService.repository.existsBy({
            name: Equal(registerDto.organizationName)
        });
        if (orgExists)
        {
            throw new ConflictException('Organization already exists');
        }

        await this.usersService.checkUniqueValue({
            userName: registerDto.userName,
            email: registerDto.email,
            phoneNumber: registerDto.phoneNumber,
        });


        const organizationEntity = new Organization();
        organizationEntity.name = registerDto.organizationName;
        await this.organizationsService.repository.save(organizationEntity);

        const roleEntity = new Role();
        roleEntity.name = appConfig().default.role;
        roleEntity.systemCreated = true;
        roleEntity.permissions = await this.permissionsService.repository.find();
        roleEntity.organization = organizationEntity;
        await this.rolesService.repository.save(roleEntity);

        const userEntity = new User();
        userEntity.userName = registerDto.userName;
        userEntity.password = await this.hashingService.hash(registerDto.password);
        userEntity.email = registerDto.email;
        userEntity.phoneNumber = registerDto.phoneNumber;
        userEntity.marks = USER_MARK_REGISTER_NEW;
        userEntity.organization = organizationEntity;
        userEntity.roles = [ roleEntity ];
        await this.usersService.repository.save(userEntity);

        const employeeEntity = new Employee();
        employeeEntity.firstName = registerDto.firstName;
        employeeEntity.lastName = registerDto.lastName;
        employeeEntity.user = userEntity;
        await this.employeesService.repository.save(employeeEntity);


        userEntity.employee = employeeEntity;
        return this.oneTimePasswordService.send(userEntity, { email: true, phone: true });
    }


    async registerResend(registerResendDto: RegisterResendDto)
    {
        await this.oneTimePasswordService.resend(registerResendDto.otpId);
    }


    async registerConfirm(registerConfirmDto: RegisterConfirmDto)
    {
        const user = await this.oneTimePasswordService.confirm(
            registerConfirmDto.otpId,
            registerConfirmDto.otpCode,
        );

        user.marks = USER_MARK_REGISTER_CONFIRMED;
        await this.usersService.repository.save(user);

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

        const user = await this.usersService.repository.findOne({
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
        /**
         * BINGO
         * - Get all unique permission from roles array
         * - Combine all permission from all roles and
         * get rid of duplicates (get unique ones)
         */
        const permissionCodeNames = [
            ...new Set(
                userRoles
                    .flatMap(role => role.permissions)
                    .map(perm => perm.codeName as PermissionType)
            )
        ];
        await this.accTokenPermStorage.insert(userId, permissionCodeNames);

        /**
         * Old Method
         */
        // const permissions = [ ...new Set(userRoles.reduce<Permission[]>((total, current) => [ ...total, ...current.permissions ], [])) ];
        // const permissionCodeNames = permissions.map(perm => perm.codeName);

        const refreshTokenId = randomUUID();
        await this.refTokenIdStorage.insert(userId, refreshTokenId);

        const [ accessToken, refreshToken ] = await Promise.all([
            this.jwtCustomService.signAccessToken({
                sub: userId,
                orgId: organizationId,
                systemAdmin,
            }),
            this.jwtCustomService.signRefreshToken({
                sub: userId,
                refreshTokenId,
            }),
        ]);


        return {
            accessToken,
            refreshToken,
            expiresIn: appConfig().jwt.accessTokenTtl,
        };
    }


    async refreshToken(refreshTokenDto: RefreshTokenDto)
    {
        try
        {
            const { sub, refreshTokenId } = await this.jwtCustomService.verifyRefreshToken(refreshTokenDto.refreshToken);

            const user = await this.usersService.repository.findOneOrFail({
                where: {
                    id: sub
                },
                relations: {
                    roles: true,
                    organization: true,
                },
            });
            await this.refTokenIdStorage.validate(user.id, refreshTokenId);
            await this.refTokenIdStorage.remove(user.id);

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
