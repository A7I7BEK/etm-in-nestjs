import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { OneTimePasswordModule } from 'src/one-time-password/one-time-password.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { ForgotPassword } from './authentication/entities/forgot-password.entity';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenManager } from './authentication/managers/access-token.manager';
import { ForgotPasswordManager } from './authentication/managers/forgot-password.manager';
import { AccessTokenPermissionStorage } from './authentication/storage/access-token-permission.storage';
import { RefreshTokenIdStorage } from './authentication/storage/refresh-token-id.storage';
import { PermissionGuard } from './authorization/guards/permission.guard';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { JwtCustomModule } from './jwt/jwt-custom.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ForgotPassword ]),
        UsersModule,
        EmployeesModule,
        RolesModule,
        PermissionsModule,
        OrganizationsModule,
        OneTimePasswordModule,
        JwtCustomModule,
    ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        },
        AccessTokenGuard,
        AuthenticationService,
        AccessTokenManager,
        ForgotPasswordManager,
        AccessTokenPermissionStorage,
        RefreshTokenIdStorage,
    ],
    controllers: [ AuthenticationController ]
})
export class IamModule { }
