
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class ReaderGrid extends Serenity.EntityGrid<any, any> {
        //protected getColumnsKey() { return 'PoolBox.Translations'; }
        //protected getDialogType() { return TranslationsDialog; }
        //protected getIdProperty() { return TranslationsRow.idProperty; }
        //protected getInsertPermission() { return TranslationsRow.insertPermission; }
        //protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        //protected getService() { return TranslationsService.baseUrl; }

        protected elements: ReaderElements;
        protected clipboardText: string;
        protected isMouseKeyPressed: boolean = false;
        protected highlightStart: number;
        protected highlightEnd: number;
        private readonly highlightedTxtClass = "highlighted-text";
        protected textHighlighter: TextHighlighter;
        protected wordInfoPanel: WordInfoPanel;

        constructor(container: JQuery) {
            super(container);

            this.slickGrid.destroy();
            this.wordInfoPanel = new WordInfoPanel($('#word-info-panel'));
            this.elements = new ReaderElements();
            this.elements.grid.setAttribute('id', 'reader-grid');   
            this.addPasteFromClipboardEventListener();
            this.setReaderMouseActions();
            this.insertReaderBeforeWordPanel();
        }

        protected addPasteFromClipboardEventListener() {
            window.addEventListener("paste", e => {
                this.clipboardText = (<ClipboardEvent>e).clipboardData.getData('Text');

                this.elements.grid.innerHTML = TextFormatter.wrapWordsInSpanElement(this.clipboardText);

                let words = this.elements.grid.querySelectorAll('.word') as NodeListOf<HTMLWordElement>;
                this.textHighlighter = new TextHighlighter(words);

            }, false)
        }

        protected fileFormatAndCheck(
            request: Requests.FileImportRequest,
            onSuccess?: (response: Responses.FileImportResponse) => void,
            opt?: Q.ServiceOptions<any>): Responses.FileImportResponse {
            return <Responses.FileImportResponse>FileImporterService.GetUploadedFileText(request, onSuccess, opt);
        }

        protected renderFileContents(response: Responses.FileImportResponse): void {
            this.elements.grid.innerHTML = TextFormatter.wrapWordsInSpanElement(response.Text);
            let words = this.elements.grid.querySelectorAll('.word') as NodeListOf<HTMLWordElement>;
            this.textHighlighter = new TextHighlighter(words);
        }

        // ----override
        protected getButtons() {
            let buttons = super.getButtons();

            buttons.push({
                cssClass: 'export-pdf-button',
                hint: 'Read text from PDF file',
                title: 'Import PDF file',
                onClick: () => {
                    var dialog = new PoolBox.FileImportDialog(this.fileFormatAndCheck, this.renderFileContents.bind(this));
                    dialog.element.on('dialogclose',
                        () => {
                            this.refresh();
                            dialog = null;
                        });
                    dialog.dialogOpen();
                },
                separator: true
            });

            return buttons;
        }

        protected setReaderMouseActions() {
            this.setReaderMouseOverAction();
            this.setReaderOnMouseDownAction();
            this.setReaderOnMouseUpAction();
        }

        protected setReaderOnMouseDownAction() {
            this.elements.grid.addEventListener('mousedown', e => {
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
            this.elements.grid.addEventListener('mouseup', e => {
                const isTextSelected = [undefined, null, -1].every(x => x !== this.highlightStart && x !== this.highlightEnd);

                if (e.button === 0) {
                    if (isTextSelected) {
                        let selectedWords = this.elements.grid.querySelectorAll(`.${this.highlightedTxtClass}`);
                        this.textHighlighter.selectHighlightedText();
                        this.highlightStart = this.highlightEnd = -1;

                        if (selectedWords.length === 1)
                            this.fetchDictionaryData(selectedWords[0].innerHTML);
                    }
                    this.isMouseKeyPressed = false;
                }
            });
        }

        protected setReaderMouseOverAction() {
            this.elements.grid.addEventListener('mouseover', e => {
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

        protected fetchDictionaryData(word: string) {
            var req: Requests.TranslationRequest = { Word: word }

            // TODO: get current language and call service based on it

            ReaderService.Translate(req, (response) => {
                //console.log(JSON.parse(response.Data));
                let respJson = JSON.parse(response.Data);
                //let entity = DictionaryParsers.SpanishParser.getTranslationData(respJson);

                this.updateWordInfoPanel(word);

                //entity.Original = text;

                //if ('shortdef' in respJson[0]) {
                //    let req: Serenity.SaveRequest<TranslationsRow> = {
                //        Entity: entity
                //    };

                //    TranslationsService.Create(
                //        req,
                //        response => console.log('Word successfully added to database')
                //    );
                //}

            });
        }

        protected updateWordInfoPanel(word: string) {
            if (this.elements.wordPanel.style.visibility == 'hidden')
                this.elements.wordPanel.style.visibility = 'visible';

            this.elements.wordName.innerHTML = word;//entity.wordType;
            //this.wordPanelElement.querySelector('#word-type').innerHTML = 'Ucho';//entity.wordType;
            //this.wordPanelElement.querySelector('#translations').innerHTML = 'Moto';//entity.translations;
            //this.wordPanelElement.querySelector('#noun-gender').innerHTML = 'Foto';//entity.nounGender;
        }

        // override
        protected usePager() {
            return false;
        }

        protected insertReaderBeforeWordPanel() {
            this.elements.reader.appendChild(this.elements.grid);
            this.elements.readerAndPanel.insertBefore(this.elements.reader, this.elements.wordPanel);

            this.element[0].appendChild(this.elements.readerAndPanel);
            this.elements.grid.classList.add('box', 'box-primary');
        }
    }

    export type HTMLWordElement = HTMLElement & {
        dataset: {
            index: string
        }
    }

    class ReaderElements {
        public wordPanel = document.querySelector('#word-info-panel') as HTMLElement;
        public readerAndPanel = document.querySelector('#grid-panel-container') as HTMLElement;
        public reader = document.querySelector('#reader-container') as HTMLElement;
        public wordName = document.querySelector('#word-name') as HTMLElement;
        public grid = document.querySelector('.grid-container') as HTMLElement;
    }

}



