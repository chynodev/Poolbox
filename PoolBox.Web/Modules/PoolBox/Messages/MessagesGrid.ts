
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class MessagesGrid extends Serenity.EntityGrid<MessagesRow, any> {
        protected getColumnsKey() { return 'PoolBox.Messages'; }
        protected getDialogType() { return MessagesDialog; }
        protected getIdProperty() { return MessagesRow.idProperty; }
        protected getInsertPermission() { return MessagesRow.insertPermission; }
        protected getLocalTextPrefix() { return MessagesRow.localTextPrefix; }
        protected getService() { return MessagesService.baseUrl; }

        protected elements: PageElements;

        constructor(container: JQuery) {
            super(container);

            this.slickGrid.destroy();
            this.elements = new PageElements();
            this.elements.grid.appendChild(this.elements.chatContainer);
            this.setTitle("Inbox");
        }

        // --override
        protected createQuickSearchInput(): void {

        }

        // --override
        protected createToolbar(buttons: Serenity.ToolButton[]): void {

        }

        // override
        protected usePager() {
            return false;
        }
    }

    class PageElements {
        public grid = document.querySelector('.grid-container') as HTMLElement;
        public chatContainer = document.querySelector('#chat-container') as HTMLElement;
    }
}