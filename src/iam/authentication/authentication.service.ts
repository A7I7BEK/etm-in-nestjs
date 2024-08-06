import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InvalidatedRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { randomUUID } from 'crypto';
import appConfig from 'src/config/app.config';

@Injectable()
export class AuthenticationService
{
    constructor (
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    ) { }

    async signUp(signUpDto: SignUpDto)
    {
        try
        {
            const user = new User();
            user.email = signUpDto.email;
            user.password = await this.hashingService.hash(signUpDto.password);

            await this.usersRepository.save(user);
        }
        catch (error)
        {
            const pgUniqueViolationErrorCode = '23505'; // should be in separate file
            if (error.code === pgUniqueViolationErrorCode)
            {
                throw new ConflictException();
            }
            throw error;
        }
    }

    async signIn(signInDto: SignInDto)
    {
        const user = await this.usersRepository.findOneBy({ userName: signInDto.userName });
        if (!user)
        {
            throw new UnauthorizedException('User does not exist');
        }

        const isEqual = await this.hashingService.compare(signInDto.password, user.password);
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

    async refreshTokens(refreshTokenDto: RefreshTokenDto)
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
