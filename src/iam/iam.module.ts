import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { ForgotPassword } from './authentication/entities/forgot-password.entity';
import { OneTimePassword } from './authentication/entities/one-time-password.entity';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { UserSerializer } from './authentication/serializers/user-serializer';
import { RolesGuard } from './authorization/guards/roles.guard';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Organization,
            User,
            Employee,
            OneTimePassword,
            ForgotPassword,
        ]),
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: appConfig().jwt.secret,
                signOptions: {
                    expiresIn: appConfig().jwt.accessTokenTtl,
                }
            }),
        }),
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
            useClass: RolesGuard,
        },
        AccessTokenGuard,
        RefreshTokenIdsStorage,
        AuthenticationService,
        UserSerializer,
    ],
    controllers: [ AuthenticationController ]
})

// Identity and Access Management (IAM)
export class IamModule { }
