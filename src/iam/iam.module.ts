import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { MailModule } from 'src/mail/mail.module';
import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { ForgotPassword } from './authentication/entities/forgot-password.entity';
import { OneTimePasswordParent } from './authentication/entities/one-time-password-parent.entity';
import { OneTimePassword } from './authentication/entities/one-time-password.entity';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { OneTimePasswordService } from './authentication/one-time-password.service';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { UserSerializer } from './authentication/serializers/user-serializer';
import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Organization,
            User,
            Employee,
            OneTimePasswordParent,
            OneTimePassword,
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
        MailModule,
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
            useClass: PermissionsGuard,
        },
        AccessTokenGuard,
        RefreshTokenIdsStorage,
        AuthenticationService,
        UserSerializer,
        OneTimePasswordService,
    ],
    controllers: [ AuthenticationController ]
})

// Identity and Access Management (IAM)
export class IamModule { }
