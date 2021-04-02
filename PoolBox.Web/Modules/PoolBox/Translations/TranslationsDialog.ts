
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class TranslationsDialog extends Serenity.EntityDialog<TranslationsRow, any> {
        protected getFormKey() { return TranslationsForm.formKey; }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getNameProperty() { return TranslationsRow.nameProperty; }
        protected getService() { return TranslationsService.baseUrl; }
        protected getDeletePermission() { return TranslationsRow.deletePermission; }
        protected getInsertPermission() { return TranslationsRow.insertPermission; }
        protected getUpdatePermission() { return TranslationsRow.updatePermission; }

        protected form = new TranslationsForm(this.idPrefix);

    }
}