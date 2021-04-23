namespace PoolBox.DictionaryParsers {

    export abstract class DictionaryParserAbstraction {
        protected static readonly wordTypes = [' noun', 'adjective', ' verb', 'adverb', 'abbreviation', 'conjunction'];
        protected static readonly genders = ['masculine', 'feminine', 'neutral'];

        public static getTranslationData(response: Responses.TranslationResponse): PoolBox.TranslationsRow {
            throw new Error('Function getTranslationData is not implemented in child class');
        }

    }

}