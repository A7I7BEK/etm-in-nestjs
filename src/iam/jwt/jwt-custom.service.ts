import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import appConfig from 'src/common/config/app.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { AccessTokenData } from './interfaces/access-token-data.interface';
import { RefreshTokenData } from './interfaces/refresh-token-data.interface';

@Injectable()
export class JwtCustomService
{
    constructor (
        private readonly _jwtService: JwtService,
    ) { }


    private readonly COMMON_CONFIG = {
        audience: appConfig().jwt.audience,
        issuer: appConfig().jwt.issuer,
    };


    signAccessToken(payload?: AccessTokenData)
    {
        return this._jwtService.signAsync(
            payload,
            {
                secret: appConfig().jwt.accessTokenSecret,
                expiresIn: appConfig().jwt.accessTokenTtl,
                ...this.COMMON_CONFIG,
            }
        );
    }


    signRefreshToken(payload?: RefreshTokenData)
    {
        return this._jwtService.signAsync(
            payload,
            {
                secret: appConfig().jwt.refreshTokenSecret,
                expiresIn: appConfig().jwt.refreshTokenTtl,
                ...this.COMMON_CONFIG,
            }
        );
    }


    verifyAccessToken(token: string)
    {
        return this._jwtService.verifyAsync<AccessTokenData>(
            token,
            {
                secret: appConfig().jwt.accessTokenSecret,
                ...this.COMMON_CONFIG,
            }
        );
    }


    verifyRefreshToken(token: string)
    {
        return this._jwtService.verifyAsync<RefreshTokenData>(
            token,
            {
                secret: appConfig().jwt.refreshTokenSecret,
                ...this.COMMON_CONFIG,
            }
        );
    }


    private signToken<T extends Partial<ActiveUserData>>(secret: string, expiresIn: number, payload?: T)
    {
        return this._jwtService.signAsync(
            payload,
            {
                secret,
                expiresIn,
                audience: appConfig().jwt.audience,
                issuer: appConfig().jwt.issuer,
            }
        );
    }
}
