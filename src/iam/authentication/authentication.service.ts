import { Injectable } from '@nestjs/common';
import { ForgotPasswordChangeDto } from './dto/forgot-password-change.dto';
import { ForgotPasswordConfirmDto } from './dto/forgot-password-confirm.dto';
import { ForgotPasswordSendDto } from './dto/forgot-password-send.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterConfirmDto } from './dto/register-confirm.dto';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenManager } from './managers/access-token.manager';

@Injectable()
export class AuthenticationService
{
    constructor (
        private readonly accessTokenManager: AccessTokenManager,
    ) { }

    register(registerDto: RegisterDto)
    {
        return this.accessTokenManager.register(registerDto);
    }

    registerResend(id: string)
    {
        return this.accessTokenManager.registerResend(id);
    }

    registerConfirm(registerConfirmDto: RegisterConfirmDto)
    {
        return this.accessTokenManager.registerConfirm(registerConfirmDto);
    }

    login(loginDto: LoginDto)
    {
        return this.accessTokenManager.login(loginDto);
    }

    refreshToken(refreshTokenDto: RefreshTokenDto)
    {
        return this.accessTokenManager.refreshToken(refreshTokenDto);
    }

    forgotPasswordSend(forgotPasswordSendDto: ForgotPasswordSendDto)
    {
        return 'aaaaa';
    }

    forgotPasswordResend(id: string)
    {
        return 'aaaaa';
    }

    forgotPasswordConfirm(forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        return 'aaaaa';
    }

    forgotPasswordChange(forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        return 'aaaaa';
    }
}
