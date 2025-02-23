import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
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
import { RefreshTokenIdsStorage } from './authentication/managers/refresh-token-ids.storage';
import { PermissionGuard } from './authorization/guards/permission.guard';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ForgotPassword ]),
        JwtModule.registerAsync({
            global: true, // BINGO: JwtModule is accessible globally now
            useFactory: async () => ({
                secret: appConfig().jwt.accessTokenSecret,
                signOptions: {
                    expiresIn: appConfig().jwt.accessTokenTtl,
                }
            }),
        }),
        UsersModule,
        EmployeesModule,
        RolesModule,
        PermissionsModule,
        OrganizationsModule,
        OneTimePasswordModule,
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
        RefreshTokenIdsStorage,
    ],
    controllers: [ AuthenticationController ]
})
export class IamModule { }
