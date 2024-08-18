import { ILanguage } from './language.interface';

export const LANGUAGE_LIST: ILanguage[] = [
    {
        code: 'en',
        name: 'English',
    },
    {
        code: 'uz',
        name: 'Uzbek',
    },
    {
        code: 'ru',
        name: 'Russian',
    },
];


export const LANGUAGE_DEFAULT: ILanguage = LANGUAGE_LIST.find(lang => lang.code = 'en');