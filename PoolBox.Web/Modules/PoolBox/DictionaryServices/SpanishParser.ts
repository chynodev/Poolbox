namespace PoolBox.DictionaryParsers {

    export class SpanishParser extends DictionaryParserAbstraction {

        public static getTranslationData(response: Responses.TranslationResponse) {
            const wordType = response[0]?.fl as string;
            const translations: string[] = response[0].shortdef?? null;
            let [type, gender] = ['', ''];
            
            SpanishParser.wordTypes.forEach(item => type = wordType?.isSubstr(item) ? item.trim() : type);
            SpanishParser.genders.forEach(item => gender = wordType?.isSubstr(item) ? item.trim() : gender);

            let entity: PoolBox.TranslationsRow = {
                WordType: type,
                NounGender: gender,
                Translated: translations.join(', ')
            };

            return entity;
        }

    }

}