import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { OneTimePasswordModule } from 'src/one-time-password/one-time-password.module';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
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
        TypeOrmModule.forFeature([
            Organization,
            User,
            Employee,
            Role,
            Permission,
            ForgotPassword,
        ]),
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: appConfig().jwt.accessTokenSecret,
                signOptions: {
                    expiresIn: appConfig().jwt.accessTokenTtl,
                }
            }),
        }),
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
