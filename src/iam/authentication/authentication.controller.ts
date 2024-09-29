import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { ForgotPasswordChangeDto } from './dto/forgot-password-change.dto';
import { ForgotPasswordConfirmDto } from './dto/forgot-password-confirm.dto';
import { ForgotPasswordSendDto } from './dto/forgot-password-send.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterConfirmDto } from './dto/register-confirm.dto';
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

    @Post('organizations/create/user')
    register(@Body() registerDto: RegisterDto)
    {
        return this.authService.register(registerDto);
    }

    @Put('organizations/create/user/resend/:id')
    registerResend(@Param('id') id: string)
    {
        return this.authService.registerResend(id);
    }

    @Post('organizations/otp/confirm')
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
    @HttpCode(HttpStatus.OK)
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto)
    {
        return this.authService.refreshToken(refreshTokenDto);
    }

    @Post('forgot/password/send/otp')
    @HttpCode(HttpStatus.OK)
    forgotPasswordSend(@Body() forgotPasswordSendDto: ForgotPasswordSendDto)
    {
        return this.authService.forgotPasswordSend(forgotPasswordSendDto);
    }

    @Put('forgot/password/resend/otp/:id')
    forgotPasswordResend(@Param('id') id: string)
    {
        return this.authService.forgotPasswordResend(id);
    }

    @Post('forgot/password/confirm/otp')
    @HttpCode(HttpStatus.OK)
    forgotPasswordConfirm(@Body() forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        return this.authService.forgotPasswordConfirm(forgotPasswordConfirmDto);
    }

    @Post('forgot/password/change/password')
    @HttpCode(HttpStatus.OK)
    forgotPasswordChange(@Body() forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        return this.authService.forgotPasswordChange(forgotPasswordChangeDto);
    }
}
