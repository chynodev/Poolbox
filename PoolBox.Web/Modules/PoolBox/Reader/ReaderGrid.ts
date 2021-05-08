﻿
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class ReaderGrid extends Serenity.EntityGrid<any, any> {
        //protected getColumnsKey() { return 'PoolBox.Translations'; }
        //protected getDialogType() { return TranslationsDialog; }
        //protected getIdProperty() { return TranslationsRow.idProperty; }
        //protected getInsertPermission() { return TranslationsRow.insertPermission; }
        //protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        //protected getService() { return TranslationsService.baseUrl; }

        protected gridContainer: HTMLElement;
        protected clipboardText: string;
        protected isMouseKeyPressed: boolean = false;
        protected highlightStart: number;
        protected highlightEnd: number;
        private readonly highlightedTxtClass = "highlighted-text";
        protected textHighlighter: TextHighlighter;

        constructor(container: JQuery) {
            super(container);

            this.slickGrid.destroy();

            this.gridContainer = document.querySelector('.grid-container');
            this.gridContainer.setAttribute('id', 'reader-grid');
            this.addPasteFromClipboardEventListener();
            this.setReaderMouseActions();

        }

        protected addPasteFromClipboardEventListener() {
            window.addEventListener("paste", e => {
                this.clipboardText = (<ClipboardEvent>e).clipboardData.getData('Text');

                this.gridContainer.innerHTML = TextFormatter.wrapWordsInSpanElement(this.clipboardText);

                let words = this.gridContainer.querySelectorAll('.word') as NodeListOf<HTMLWordElement>;
                this.textHighlighter = new TextHighlighter(words);

            }, false)
        }

        protected setReaderMouseActions() {
            this.setReaderMouseOverAction();
            this.setReaderOnMouseDownAction();
            this.setReaderOnMouseUpAction();
        }

        protected setReaderOnMouseDownAction() {
            this.gridContainer.addEventListener('mousedown', e => {
                let target = e.target as HTMLWordElement;
                let selectedText: string[] = [];

                if (e.button === 0 && target.classList.contains('word')) {
                    this.isMouseKeyPressed = true;
                    this.highlightStart = parseInt(target.dataset.index);
                    this.highlightEnd = parseInt(target.dataset.index);
                    selectedText = this.textHighlighter.highlightText(this.highlightStart, this.highlightEnd);

                    //if (selectedText)
                    // EXECUTE TRANSLATION
                    // TRANSLATE IF TEXT CONTAINS MORE THAN ONE WORD, TRANSLATE AND CALL A DICTIONARY IF TEXT CONTAINS 1 WORD
                }
            });
        }

        protected setReaderOnMouseUpAction() {
            this.gridContainer.addEventListener('mouseup', e => {
                const isTextSelected = [undefined, null, -1].every(x => x !== this.highlightStart && x !== this.highlightEnd);

                if (e.button === 0) {
                    if (isTextSelected) {
                        this.textHighlighter.selectHighlightedText();
                        this.highlightStart = this.highlightEnd = -1;
                    }
                    this.isMouseKeyPressed = false;
                }
            });
        }

        protected setReaderMouseOverAction() {
            this.gridContainer.addEventListener('mouseover', e => {
                let target = e.target as HTMLWordElement;
                let selectedText: string[] = [];

                if (this.isMouseKeyPressed && target.classList.contains('word')) {
                    this.highlightEnd = target.dataset.index.toNumber();

                    if (target.classList.contains(this.highlightedTxtClass)) {
                        this.textHighlighter.unHighlightText(this.highlightStart, this.highlightEnd);

                    } else {
                        selectedText = this.textHighlighter.highlightText(this.highlightStart, this.highlightEnd);

                        //if (selectedText)
                        // EXECUTE TRANSLATION
                        // TRANSLATE IF TEXT CONTAINS MORE THAN ONE WORD, TRANSLATE AND CALL A DICTIONARY IF TEXT CONTAINS 1 WORD
                    }
                }
            });
        }

        protected fetchTextData(text: string) {
            var req: Requests.TranslationRequest = { Word: text }

            ReaderService.Translate(req, (response) => {
                let respJson = JSON.parse(response.Data);
                let entity = DictionaryParsers.SpanishParser.getTranslationData(respJson);
                entity.Original = text;

                if ('shortdef' in respJson[0]) {
                    let req: Serenity.SaveRequest<TranslationsRow> = {
                        Entity: entity
                    };

                    TranslationsService.Create(
                        req,
                        response => console.log('Word successfully added to database')
                    );
                }

            });
        }

        // override
        protected usePager() {
            return false;
        }
    }

    export type HTMLWordElement = HTMLElement & {
        dataset: {
            index: string
        }
    }

    

}



