
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class TranslationsGrid extends Serenity.EntityGrid<TranslationsRow, any> {
        protected getColumnsKey() { return 'PoolBox.Translations'; }
        protected getDialogType() { return TranslationsDialog; }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getInsertPermission() { return TranslationsRow.insertPermission; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getService() { return TranslationsService.baseUrl; }

        constructor(container: JQuery) {
            super(container);
        }
    }
}