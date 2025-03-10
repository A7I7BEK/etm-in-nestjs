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
    name: keyof typeof Language; // BINGO: type is one of the key names of Language
}
