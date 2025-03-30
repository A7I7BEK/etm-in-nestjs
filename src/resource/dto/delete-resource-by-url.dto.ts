import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteResourceByUrlDto
{
    @IsNotEmpty()
    @IsString()
    url: string;
}
