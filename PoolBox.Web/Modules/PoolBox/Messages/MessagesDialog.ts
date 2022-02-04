
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class MessagesDialog extends Serenity.EntityDialog<MessagesRow, any> {
        protected getFormKey() { return MessagesForm.formKey; }
        protected getIdProperty() { return MessagesRow.idProperty; }
        protected getLocalTextPrefix() { return MessagesRow.localTextPrefix; }
        protected getNameProperty() { return MessagesRow.nameProperty; }
        protected getService() { return MessagesService.baseUrl; }
        protected getDeletePermission() { return MessagesRow.deletePermission; }
        protected getInsertPermission() { return MessagesRow.insertPermission; }
        protected getUpdatePermission() { return MessagesRow.updatePermission; }

        protected form = new MessagesForm(this.idPrefix);

    }
}