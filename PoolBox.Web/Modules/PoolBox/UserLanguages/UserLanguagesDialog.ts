
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class UserLanguagesDialog extends Serenity.EntityDialog<UserLanguagesRow, any> {
        protected getFormKey() { return UserLanguagesForm.formKey; }
        protected getIdProperty() { return UserLanguagesRow.idProperty; }
        protected getLocalTextPrefix() { return UserLanguagesRow.localTextPrefix; }
        protected getNameProperty() { return UserLanguagesRow.nameProperty; }
        protected getService() { return UserLanguagesService.baseUrl; }
        protected getDeletePermission() { return UserLanguagesRow.deletePermission; }
        protected getInsertPermission() { return UserLanguagesRow.insertPermission; }
        protected getUpdatePermission() { return UserLanguagesRow.updatePermission; }

        protected form = new UserLanguagesForm(this.idPrefix);

    }
}