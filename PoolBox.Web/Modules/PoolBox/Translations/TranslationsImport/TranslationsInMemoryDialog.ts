namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class TranslationsInMemoryDialog extends Common.GridEditorDialog<TranslationsRow> {
        protected getFormKey() { return TranslationsForm.formKey; }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getNameProperty() { return TranslationsRow.nameProperty; }
        protected getService() { return TranslationsService.baseUrl; }
        protected getDeletePermission() { return TranslationsRow.deletePermission; }
        protected getInsertPermission() { return TranslationsRow.insertPermission; }
        protected getUpdatePermission() { return TranslationsRow.updatePermission; }

        protected form = new TranslationsForm(this.idPrefix);

        constructor() {
            super();

        }

        protected saveHandler(options: Serenity.ServiceOptions<Serenity.SaveResponse>,
            callback: (response: Serenity.SaveResponse) => void) {

            var entity: TranslationsRow = options.request.Entity;

            if (this.form.Original.value
                && this.form.Translated.value
                && this.form.WordType.value
            ) {
                entity.Original = this.form.Original.value;
                entity.Translated = this.form.Translated.value;
                entity.WordType = this.form.WordType.value;
            }
            super.saveHandler(options, callback);
        }
    }
}