namespace PoolBox.PoolBox {
    export class TextHighlighter {
        private words: HTMLWordElement[] = [];
        private readonly highlightedTxtClass = "highlighted-text";
        private readonly selectedTxtClass = "selected-text";

        constructor(words: NodeListOf<HTMLWordElement>) {
            this.toArray(words);
        }

        // transforms nodeList of words to an array
        private toArray(words: NodeListOf<HTMLWordElement>) {
            words.forEach(word => {
                this.words[parseInt(word.dataset.index)] = word;
            });
        }

        // highlights text from start index to end index...un-highlights text if highlight direction was changed
        // highlights max 10 words
        public highlightText(startIdx: number, endIdx: number): string[] {
            let counter = 1;
            let selectedText: string[] = [];

            if (endIdx < startIdx) {
                for (let idx = startIdx; idx >= endIdx; idx--, counter--) {
                    this.words[idx].classList.add(this.highlightedTxtClass);

                    if (counter < -10) {
                        this.unHighlightText(startIdx, startIdx);
                        return null;
                    }
                    selectedText.unshift(this.words[idx].innerHTML);
                }
                this.unHighlightToRight(startIdx);
            } else {
                for (let idx = startIdx; idx <= endIdx; idx++, counter++) {
                    this.words[idx].classList.add(this.highlightedTxtClass);

                    if (counter > 10) {
                        this.unHighlightText(startIdx, startIdx);
                        return null;
                    }
                    selectedText.push(this.words[idx].innerHTML);
                }
                this.unHighlightToLeft(startIdx);
            }
            return selectedText;
        }

        // un-highlights text from startIdx to endIdx
        public unHighlightText(startIdx: number, endIdx: number) {
            if (endIdx < startIdx)
                this.unHighlightToLeft(endIdx);

            else if (endIdx > startIdx)
                this.unHighlightToRight(endIdx);

            else {
                this.unHighlightToLeft(endIdx);
                this.unHighlightToRight(endIdx);
            }
        }

        // un-highlights text to the left from idx
        private unHighlightToLeft(idx: number) {
            idx--;

            while (idx > 0 && this.words[idx].classList.contains(this.highlightedTxtClass)) {
                this.words[idx].classList.remove(this.highlightedTxtClass);
                idx--;
            }
        }

        // un-highlights text to the right from idx
        private unHighlightToRight(idx: number) {
            idx++;

            while (idx < this.words.length && this.words[idx].classList.contains(this.highlightedTxtClass)) {
                this.words[idx].classList.remove(this.highlightedTxtClass);
                idx++;
            }
        }

        public selectHighlightedText() {
            this.words.forEach(word => {
                if (word.classList.contains(this.highlightedTxtClass)) {
                    word.classList.remove(this.highlightedTxtClass);
                    word.classList.add(this.selectedTxtClass);
                }
            });
        }
    }
}