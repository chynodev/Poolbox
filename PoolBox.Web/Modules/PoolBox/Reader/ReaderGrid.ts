
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

        constructor(container: JQuery) {
            super(container);

            this.slickGrid.destroy();

            this.gridContainer = document.querySelector('.grid-container');
            this.gridContainer.setAttribute('id', 'reader-grid');
            this.addPasteFromClipboardEventListener();
            this.setReaderOnClickAction();
        }

        protected addPasteFromClipboardEventListener() {

            window.addEventListener("paste", e => {
                this.clipboardText = (<ClipboardEvent>e).clipboardData.getData('Text');

                this.gridContainer.innerHTML = TextFormatter.wrapWordsInSpanElement(this.clipboardText);

            }, false)
        }

        // override
        protected usePager() {
            return false;
        }

        protected setReaderOnClickAction() {
            this.gridContainer.addEventListener('click', e => {
               let target = e.target as Element;

                if (target.classList.contains('word'))
                    this.fetchTextData(target.innerHTML);
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

    }
}



