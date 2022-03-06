
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionGrid extends Serenity.EntityGrid<TranslationsRow, any> {
        protected getColumnsKey() { return 'PoolBox.Translations'; }
        protected getDialogType() { return null; }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getInsertPermission() { return TranslationsRow.insertPermission; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getService() { return TranslationsService.baseUrl; }

        protected clipboardText: string;
        protected pastedRows: TranslationsRow[];
        private rowSelection: Serenity.GridRowSelectionMixin;
        protected isImportMode: boolean = false;
        protected errorColumn: Slick.Column;
        protected sendMessageFunction: (wordIds: string) => void;

        constructor(container: JQuery, sendMessageFunction: (wordIds: string) => void) {
            super(container);

            this.sendMessageFunction = sendMessageFunction;
            this.rowSelection = new Serenity.GridRowSelectionMixin(this);
            let currentLng = new Common.LanguagePairPreference().getItem();
        }

        // -- override
        protected getButtons(): Serenity.ToolButton[] {
            let self = this;
            let buttons: Serenity.ToolButton[] = [];
            buttons.push({
                title: 'Send selected words',
                onClick: () => {
                    self.sendMessageFunction(self.rowSelection.getSelectedAsInt64().toString());
                },
                cssClass: 'mail-button'
            });

            return buttons;
        }

        // -- override
        protected getColumns(): Slick.Column[] {
            var columns = super.getColumns();
            columns.unshift(Serenity.GridRowSelectionMixin.createSelectColumn(() => this.rowSelection));
            return columns;
        }
    }

}