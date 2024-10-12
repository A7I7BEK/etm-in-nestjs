import { Language } from './language.enum';

export interface ILanguage
{
    /**
     * The code of Language
     */
    code: Language;

    /**
     * The name of Language
     */
    name: keyof typeof Language; // BINGO
}

/**
 * change language
 */
// const aaaaaaaa = Object.keys(Language).find(key => Language[ key ] === Language.Uzbek) as (keyof typeof Language);
// const ccccc = new User();
// ccccc.language = { code: Language.Uzbek, name: aaaaaaaa };