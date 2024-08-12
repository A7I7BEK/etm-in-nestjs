import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import appConfig from 'src/config/app.config';
import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { OneTimePassword } from './entities/one-time-password.entity';
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
        @InjectRepository(OneTimePassword)
        private readonly otpsRepository: Repository<OneTimePassword>,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
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


        const user = await this.usersRepository.save({
            userName: registerDto.userName,
            password: await this.hashingService.hash(registerDto.password),
            email: registerDto.email,
            phoneNumber: registerDto.phoneNumber,
            employee: await this.employeesRepository.save({
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
            }),
            organization: await this.organizationsRepository.save({
                name: registerDto.organizationName,
            }),
        });

        await this.otpsRepository.save({
            otpId: randomUUID(),
            otpCode: 123456, // email implementation
            expireTime: Date.now().toString(),
            user,
        });
    }

    async login(loginDto: LoginDto)
    {
        const user = await this.usersRepository.findOneBy({ userName: loginDto.userName });
        if (!user)
        {
            throw new UnauthorizedException('User does not exist');
        }

        const isEqual = await this.hashingService.compare(loginDto.password, user.password);
        if (!isEqual)
        {
            throw new UnauthorizedException('Password does not match');
        }

        return this.generateTokens(user);
    }

    async generateTokens(user: User)
    {
        const refreshTokenId = randomUUID();
        const [ accessToken, refreshToken ] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                appConfig().jwt.accessTokenTtl,
                {
                    email: user.email,
                    role: user.role,
                }
            ),
            this.signToken(
                user.id,
                appConfig().jwt.refreshTokenTtl,
                { refreshTokenId }
            ),
        ]);

        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

        return {
            accessToken,
            refreshToken,
        };
    }

    private signToken<T>(userId: number, expiresIn: number, payload?: T)
    {
        return this.jwtService.signAsync(
            {
                sub: userId,
                ...payload
            },
            {
                audience: appConfig().jwt.audience,
                issuer: appConfig().jwt.issuer,
                secret: appConfig().jwt.secret,
                expiresIn,
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
                        secret: appConfig().jwt.secret,
                        audience: appConfig().jwt.audience,
                        issuer: appConfig().jwt.issuer,
                    }
                );

            const user = await this.usersRepository.findOneByOrFail({ id: sub });
            const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);

            /**
             * Custom Note: if clause may not be needed as this.refreshTokenIdsStorage.validate
             * throws error if something is wrong
             * We can easily call this.refreshTokenIdsStorage.invalidate after that
             */
            if (isValid)
            {
                await this.refreshTokenIdsStorage.invalidate(user.id);
            }
            else
            {
                throw new Error('Refresh token is invalid');
            }

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
