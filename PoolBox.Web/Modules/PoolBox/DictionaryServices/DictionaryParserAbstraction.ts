namespace PoolBox.DictionaryParsers {

    export abstract class DictionaryParserAbstraction {
        protected static readonly wordTypes = [' noun', 'adjective', ' verb', 'adverb', 'abbreviation', 'conjunction'];
        protected static readonly genders = ['masculine', 'feminine', 'neutral'];

        public static getTranslationData(response: Responses.TranslationResponse): DictionaryTranslationRow {
            throw new Error('Function getTranslationData is not implemented in child class');
        }

    }

    export interface DictionaryTranslationRow {
        translations: string;
        audio?: any;
        wordType: string;
        nounGender: string;
        definition?: string;
        examples?: string;
    }

}