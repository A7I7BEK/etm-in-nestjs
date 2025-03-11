import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { JwtCustomService } from 'src/iam/jwt/jwt-custom.service';

@Injectable()
export class AccessTokenGuard implements CanActivate
{
    constructor (
        private readonly _jwtCustomService: JwtCustomService,
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
            const payload = await this._jwtCustomService.verifyAccessToken(token);
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
