import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController
{
    constructor (
        private readonly authService: AuthenticationService,
    ) { }

    @Post('organizations/create/user')
    register(@Body() signUpDto: SignUpDto)
    {
        return this.authService.signUp(signUpDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('organizations/create/user/resend')
    registerResend(@Body() signInDto: SignInDto)
    {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('organizations/otp/confirm')
    registerConfirm(@Body() signInDto: SignInDto)
    {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() signInDto: SignInDto)
    {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto)
    {
        return this.authService.refreshTokens(refreshTokenDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgot/password/send/otp')
    forgotPasswordSend(@Body() signInDto: SignInDto)
    {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgot/password/resend/otp')
    forgotPasswordResend(@Body() signInDto: SignInDto)
    {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgot/password/confirm/otp')
    forgotPasswordConfirm(@Body() signInDto: SignInDto)
    {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgot/password/change/password')
    forgotPasswordChange(@Body() signInDto: SignInDto)
    {
        return this.authService.signIn(signInDto);
    }
}
