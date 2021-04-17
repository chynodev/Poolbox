namespace PoolBox.DictionaryParsers {

    export class SpanishParser {
        private static readonly wordTypes = [' noun', 'adjective', 'verb'];
        private static readonly genders = ['masculine', 'feminine', 'neutral'];

        public static getWordTypeAndGender(response: any): [type: string, gender: string] {
            const wordType = response[0]?.fl as string;
            let type: string;
            let gender: string;

            SpanishParser.wordTypes.forEach(item => type = (wordType.includes(item) ? item.trim() : type));
            SpanishParser.genders.forEach(item => gender = (wordType.includes(item) ? item.trim() : gender));

            return [type, gender];
        }

    }

}