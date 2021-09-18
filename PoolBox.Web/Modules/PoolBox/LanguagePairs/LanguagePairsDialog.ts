
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class LanguagePairsDialog extends Serenity.EntityDialog<LanguagePairsRow, any> {
        protected getFormKey() { return LanguagePairsForm.formKey; }
        protected getIdProperty() { return LanguagePairsRow.idProperty; }
        protected getLocalTextPrefix() { return LanguagePairsRow.localTextPrefix; }
        protected getNameProperty() { return LanguagePairsRow.nameProperty; }
        protected getService() { return LanguagePairsService.baseUrl; }
        protected getDeletePermission() { return LanguagePairsRow.deletePermission; }
        protected getInsertPermission() { return LanguagePairsRow.insertPermission; }
        protected getUpdatePermission() { return LanguagePairsRow.updatePermission; }

        protected form = new LanguagePairsForm(this.idPrefix);

    }
}