import { Injectable } from '@nestjs/common';
import { ForgotPasswordChangeDto } from './dto/forgot-password-change.dto';
import { ForgotPasswordConfirmDto } from './dto/forgot-password-confirm.dto';
import { ForgotPasswordSendDto } from './dto/forgot-password-send.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterConfirmDto } from './dto/register-confirm.dto';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenManager } from './managers/access-token.manager';
import { ForgotPasswordManager } from './managers/forgot-password.manager';

@Injectable()
export class AuthenticationService
{
    constructor (
        private readonly accessTokenManager: AccessTokenManager,
        private readonly forgotPasswordManager: ForgotPasswordManager,
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
        return this.forgotPasswordManager.forgotPasswordSend(forgotPasswordSendDto);
    }

    forgotPasswordResend(id: string)
    {
        return this.forgotPasswordManager.forgotPasswordResend(id);
    }

    forgotPasswordConfirm(forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        return this.forgotPasswordManager.forgotPasswordConfirm(forgotPasswordConfirmDto);
    }

    forgotPasswordChange(forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        return this.forgotPasswordManager.forgotPasswordChange(forgotPasswordChangeDto);
    }
}
