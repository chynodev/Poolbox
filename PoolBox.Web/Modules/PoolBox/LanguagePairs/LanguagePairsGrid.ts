
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class LanguagePairsGrid extends Serenity.EntityGrid<LanguagePairsRow, any> {
        protected getColumnsKey() { return 'PoolBox.LanguagePairs'; }
        protected getDialogType() { return LanguagePairsDialog; }
        protected getIdProperty() { return LanguagePairsRow.idProperty; }
        protected getInsertPermission() { return LanguagePairsRow.insertPermission; }
        protected getLocalTextPrefix() { return LanguagePairsRow.localTextPrefix; }
        protected getService() { return LanguagePairsService.baseUrl; }

        constructor(container: JQuery) {
            super(container);
        }
    }
}