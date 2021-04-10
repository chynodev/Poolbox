namespace PoolBox.PoolBox {

    export abstract class TextFormatter {


        private static isLetter(letter: string): boolean {
            let unicode = letter.charCodeAt(0);
            const isBetween = (min, max) => min <= unicode && unicode <= max;

            return isBetween(65, 90) || isBetween(97, 122) || isBetween(192, 214)
                || isBetween(216, 246) || isBetween(248, 447) || isBetween(452, 591);
        }

        public static wrapWordsInSpanElement(text: string): string {
            let separatedWords = text.split(/ +/);

            separatedWords.forEach(function (word, idx) {

                let startIdx = 0;
                separatedWords[idx] = '';

                for (let i = 0; i < word.length; i++) {
                    if (!TextFormatter.isLetter(word[i])) {
                        if (i > 0 && TextFormatter.isLetter(word[i - 1]))
                            separatedWords[idx] += '<span class="word">' + word.slice(startIdx, i) + '</span>' + word[i];
                        else
                            separatedWords[idx] += word[i];

                        startIdx = i + 1;
                    } 
                }
                if (startIdx <= word.length && word.length > 0)
                    separatedWords[idx] += '<span class="word">' + word.slice(startIdx) + '</span>';
            });

            return separatedWords.join(' ').replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
    }
}