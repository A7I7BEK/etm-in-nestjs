import { Language } from './language.enum';
import { ILanguage } from './language.interface';

export const LANGUAGE_LIST: ILanguage[] = [
    {
        code: Language.English,
        name: 'English',
    },
    {
        code: Language.Uzbek,
        name: 'Uzbek',
    },
    {
        code: Language.Russian,
        name: 'Russian',
    },
];


export const LANGUAGE_DEFAULT: ILanguage = LANGUAGE_LIST.find(lang => lang.code = Language.English);
