
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

        constructor(container: JQuery) {
            super(container);

            this.rowSelection = new Serenity.GridRowSelectionMixin(this);
            let currentLng = new Common.LanguagePairPreference().getItem();
        }

        // -- override
        protected getButtons(): Serenity.ToolButton[] {
            let buttons: Serenity.ToolButton[] = [];
            buttons.push({
                title: 'Send selected words',
                onClick: () => { console.log(this.rowSelection.getSelectedAsInt32()); },
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