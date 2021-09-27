namespace PoolBox.PoolBox {

    export abstract class TextFormatter {

        private static isLetter(letter: string): boolean {
            let unicode = letter.charCodeAt(0);
            const isBetween = (min, max) => min <= unicode && unicode <= max;
            // TODO: russian alphabet is not recognized as valid
            return isBetween(65, 90) || isBetween(97, 122) || isBetween(192, 214)
                || isBetween(216, 246) || isBetween(248, 447) || isBetween(452, 591);
        }

        public static wrapWordsInSpanElement(text: string): string {
            let separatedWords = text.split(/ +/);
            let wordIdx = 0;

            const isNonWord = (text: string) => text.split('').every(x => !TextFormatter.isLetter(x));
            const addNonWord = (word: string) => '<span data-index="' + (++wordIdx) + '" class="non-word">' + word + '</span>';
            const addWord = (word: string) => '<span data-index="' + (++wordIdx) + '" class="word">' + word + '</span>';

            separatedWords.forEach(function (word, idx) {
                if (isNonWord(word)) {
                    separatedWords[idx] = addNonWord(word);
                    return;
                }

                let wordStartIdx = 0;
                let nonWordStartIdx: number = null;
                separatedWords[idx] = '';

                for (let i = 0; i < word.length; i++) {
                    if (!TextFormatter.isLetter(word[i])) {
                        nonWordStartIdx ??= i;

                        if (i > 0 && TextFormatter.isLetter(word[i - 1]))
                            separatedWords[idx] += addWord(word.slice(wordStartIdx, i));

                        wordStartIdx = i + 1;
                    } else {
                        if (nonWordStartIdx != null && (wordStartIdx - nonWordStartIdx) > 0) {
                            separatedWords[idx] += addNonWord(word.slice(nonWordStartIdx, wordStartIdx));
                        }
                        nonWordStartIdx = null;
                    }
                }
                if (wordStartIdx < word.length && word.length > 0)
                    separatedWords[idx] += addWord(word.slice(wordStartIdx));
            });

            return separatedWords.join(' ').replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
    }
}