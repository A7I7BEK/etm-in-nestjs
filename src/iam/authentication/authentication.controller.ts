import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthType } from './enums/auth-type.enum';
import { RegisterConfirmDto } from './dto/register-confirm.dto';
import { ForgotPasswordSendDto } from './dto/forgot-password-send.dto';
import { ForgotPasswordConfirmDto } from './dto/forgot-password-confirm.dto';
import { ForgotPasswordChangeDto } from './dto/forgot-password-change.dto';

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
        return 'aaaaa' + id;
    }

    @Post('organizations/otp/confirm')
    @HttpCode(HttpStatus.OK)
    registerConfirm(@Body() registerConfirmDto: RegisterConfirmDto)
    {
        return 'aaaaa';
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
        return 'aaaaa';
    }

    @Put('forgot/password/resend/otp/:id')
    forgotPasswordResend(@Param('id') id: string)
    {
        return 'aaaaa' + id;
    }

    @Post('forgot/password/confirm/otp')
    @HttpCode(HttpStatus.OK)
    forgotPasswordConfirm(@Body() forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        return 'aaaaa';
    }

    @Post('forgot/password/change/password')
    @HttpCode(HttpStatus.OK)
    forgotPasswordChange(@Body() forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        return 'aaaaa';
    }
}
