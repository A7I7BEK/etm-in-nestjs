import { Language, LanguageKey } from './language.enum';
import { ILanguage } from './language.interface';

export const LANGUAGE_DEFAULT: ILanguage = { // BINGO: special type checker
    code: Language.ENGLISH,
    name: LanguageKey[ Language.ENGLISH ],
};
