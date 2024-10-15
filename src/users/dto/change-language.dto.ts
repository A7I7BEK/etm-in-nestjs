import { IsEnum } from 'class-validator';
import { Language } from '../language/language.enum';

export class ChangeLanguageDto
{
    @IsEnum(Language)
    langCode: Language;
}
