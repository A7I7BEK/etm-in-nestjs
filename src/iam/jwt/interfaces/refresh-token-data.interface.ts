import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface RefreshTokenData extends Pick<ActiveUserData, 'sub'>
{
    refreshTokenId: string;
}
