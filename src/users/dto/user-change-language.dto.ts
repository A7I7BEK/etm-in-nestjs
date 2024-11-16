import { IsEnum } from 'class-validator';
import { Language } from '../language/language.enum';

export class UserChangeLanguageDto
{
    @IsEnum(Language)
    langCode: Language;
}
