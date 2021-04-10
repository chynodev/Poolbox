
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

        //protected fetchWordData() {
            

        //    Q.serviceCall({
        //        url: 
        //    });
        //}

        //private readonly spanishDictApi = 'https://www.dictionaryapi.com/api/v3/references/spanish/json/';
        //private readonly spanishDictApiKey = 'c5eeee9e-cf36-4114-b565-1416e8c1296b';
    }
}