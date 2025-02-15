import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { ForgotPasswordChangeDto } from './dto/forgot-password-change.dto';
import { ForgotPasswordConfirmDto } from './dto/forgot-password-confirm.dto';
import { ForgotPasswordResendDto } from './dto/forgot-password-resend.dto';
import { ForgotPasswordSendDto } from './dto/forgot-password-send.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterConfirmDto } from './dto/register-confirm.dto';
import { RegisterResendDto } from './dto/register-resend.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthType } from './enums/auth-type.enum';

@Auth(AuthType.None)
@ApiTags('auth')
@Controller('auth')
export class AuthenticationController
{
    constructor (
        private readonly authService: AuthenticationService,
    ) { }


    @Post('register')
    register(@Body() registerDto: RegisterDto)
    {
        return this.authService.register(registerDto);
    }


    @Post('register/resend')
    @HttpCode(HttpStatus.OK)
    registerResend(@Body() registerResendDto: RegisterResendDto)
    {
        return this.authService.registerResend(registerResendDto);
    }


    @Post('register/confirm')
    @HttpCode(HttpStatus.OK)
    registerConfirm(@Body() registerConfirmDto: RegisterConfirmDto)
    {
        return this.authService.registerConfirm(registerConfirmDto);
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto)
    {
        return this.authService.login(loginDto);
    }


    @Post('refresh-token')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto)
    {
        return this.authService.refreshToken(refreshTokenDto);
    }


    @Post('forgot-password/send')
    @HttpCode(HttpStatus.OK)
    forgotPasswordSend(@Body() forgotPasswordSendDto: ForgotPasswordSendDto)
    {
        return this.authService.forgotPasswordSend(forgotPasswordSendDto);
    }


    @Post('forgot-password/resend')
    @HttpCode(HttpStatus.OK)
    forgotPasswordResend(@Body() forgotPasswordResendDto: ForgotPasswordResendDto)
    {
        return this.authService.forgotPasswordResend(forgotPasswordResendDto);
    }


    @Post('forgot-password/confirm')
    @HttpCode(HttpStatus.OK)
    forgotPasswordConfirm(@Body() forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        return this.authService.forgotPasswordConfirm(forgotPasswordConfirmDto);
    }


    @Post('forgot-password/change')
    @HttpCode(HttpStatus.OK)
    forgotPasswordChange(@Body() forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        return this.authService.forgotPasswordChange(forgotPasswordChangeDto);
    }
}
