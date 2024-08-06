import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import appConfig from 'src/config/app.config';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate
{
    constructor (
        private readonly jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token)
        {
            throw new UnauthorizedException();
        }

        try
        {
            /**
             * Custom Note: right now, endpoints work with both access and refresh tokens.
             * I think the problem is in this line 👇. Specifically, in "this.jwtConfiguration"
             */
            const payload = await this.jwtService.verifyAsync(token, appConfig().jwt);
            request[ REQUEST_USER_KEY ] = payload; // bind current user to request (express)
        }
        catch (error)
        {
            throw new UnauthorizedException();
        }

        return true;
    }


    private extractTokenFromHeader(request: Request): string | undefined
    {
        const [ type, token ] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
