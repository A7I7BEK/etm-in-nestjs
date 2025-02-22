export enum Language
{
    ENGLISH = 'en',
    UZBEK = 'uz',
    RUSSIAN = 'ru',
}


// BINGO: get key name using value
export const LanguageKey = {
    [ Language.ENGLISH ]: 'ENGLISH',
    [ Language.UZBEK ]: 'UZBEK',
    [ Language.RUSSIAN ]: 'RUSSIAN',
} as const;