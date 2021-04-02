
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
            this.addPasteFromClipboardEventListener();
        }

        protected addPasteFromClipboardEventListener() {

            window.addEventListener("paste", e => {
                this.clipboardText = (<ClipboardEvent>e).clipboardData.getData('Text');
                console.log(this.clipboardText);

                this.gridContainer.innerHTML = this.clipboardText.replace(/(?:\r\n|\r|\n)/g, '<br>');

            }, false)
        }
    }
}