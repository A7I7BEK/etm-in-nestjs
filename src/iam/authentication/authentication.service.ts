import { Injectable } from '@nestjs/common';
import { ForgotPasswordChangeDto } from './dto/forgot-password-change.dto';
import { ForgotPasswordConfirmDto } from './dto/forgot-password-confirm.dto';
import { ForgotPasswordResendDto } from './dto/forgot-password-resend.dto';
import { ForgotPasswordSendDto } from './dto/forgot-password-send.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterConfirmDto } from './dto/register-confirm.dto';
import { RegisterResendDto } from './dto/register-resend.dto';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenManager } from './managers/access-token.manager';
import { ForgotPasswordManager } from './managers/forgot-password.manager';

@Injectable()
export class AuthenticationService
{
    constructor (
        private readonly _accessTokenManager: AccessTokenManager,
        private readonly _forgotPasswordManager: ForgotPasswordManager,
    ) { }


    register(registerDto: RegisterDto)
    {
        return this._accessTokenManager.register(registerDto);
    }


    registerResend(registerResendDto: RegisterResendDto)
    {
        return this._accessTokenManager.registerResend(registerResendDto);
    }


    registerConfirm(registerConfirmDto: RegisterConfirmDto)
    {
        return this._accessTokenManager.registerConfirm(registerConfirmDto);
    }


    login(loginDto: LoginDto)
    {
        return this._accessTokenManager.login(loginDto);
    }


    refreshToken(refreshTokenDto: RefreshTokenDto)
    {
        return this._accessTokenManager.refreshToken(refreshTokenDto);
    }


    forgotPasswordSend(forgotPasswordSendDto: ForgotPasswordSendDto)
    {
        return this._forgotPasswordManager.forgotPasswordSend(forgotPasswordSendDto);
    }


    forgotPasswordResend(forgotPasswordResendDto: ForgotPasswordResendDto)
    {
        return this._forgotPasswordManager.forgotPasswordResend(forgotPasswordResendDto);
    }


    forgotPasswordConfirm(forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        return this._forgotPasswordManager.forgotPasswordConfirm(forgotPasswordConfirmDto);
    }


    forgotPasswordChange(forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        return this._forgotPasswordManager.forgotPasswordChange(forgotPasswordChangeDto);
    }
}
