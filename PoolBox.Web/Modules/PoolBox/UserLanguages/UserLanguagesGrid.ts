
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class UserLanguagesGrid extends Serenity.EntityGrid<UserLanguagesRow, any> {
        protected getColumnsKey() { return 'PoolBox.UserLanguages'; }
        protected getDialogType() { return UserLanguagesDialog; }
        protected getIdProperty() { return UserLanguagesRow.idProperty; }
        protected getInsertPermission() { return UserLanguagesRow.insertPermission; }
        protected getLocalTextPrefix() { return UserLanguagesRow.localTextPrefix; }
        protected getService() { return UserLanguagesService.baseUrl; }

        constructor(container: JQuery) {
            super(container);
        }
    }
}