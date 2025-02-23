import { Language, LanguageKey } from './language.enum';
import { ILanguage } from './language.interface';

export const LANGUAGE_DEFAULT: ILanguage = { // BINGO: special type usage
    code: Language.ENGLISH,
    name: LanguageKey[ Language.ENGLISH ], // BINGO: get key name using value
};
