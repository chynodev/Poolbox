
namespace PoolBox.PoolBox {

    @Serenity.Decorators.panel()
    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.responsive()
    export class TranslationsPanelDialog extends Serenity.EntityDialog<TranslationsRow, any> {
        protected getFormKey() { return TranslationsForm.formKey; }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getService() { return TranslationsService.baseUrl; }

        protected form = new TranslationsForm(this.idPrefix);
        private onDeleteGridAction: () => void;
        private onSaveGridAction: (updatedCard: TranslationsRow) => void;

        constructor(options: WordInfoOptions) {
            super();
            this.element.addClass('flex-layout');
            this.element.removeClass('hidden');
            this.arrange();
            this.onDeleteGridAction = options.onDeleteGridAction;
            this.onSaveGridAction = options.onSaveGridAction;
            this.element.hide();
        }

        protected getToolbarButtons(): Serenity.ToolButton[] {
            let buttons = super.getToolbarButtons().filter(x => x.title == 'Save');

            buttons.push({
                title: 'Delete',
                cssClass: 'delete-button',
                onClick: () => {
                    TranslationsService.Delete(
                        { EntityId: this.entityId },
                        () => {
                            if (this.onDeleteGridAction)
                                this.onDeleteGridAction();
                        },
                        null
                    );
                }
            });
            buttons.forEach((x, idx) => x.separator = idx > 0);

            return buttons;
        }

        onSaveSuccess(response: Serenity.SaveResponse) {
            super.onSaveSuccess(response);
            
            Q.notifySuccess("Saved successfully!", null, { timeOut: 3000 });
        }

        protected saveHandler(
            options: Serenity.ServiceOptions<Serenity.SaveResponse>,
            callback: (response: Serenity.SaveResponse) => void)
        {
            if (this.onSaveGridAction)
                this.onSaveGridAction(options.request.Entity);

            super.saveHandler(options, callback);
        }
    }
}