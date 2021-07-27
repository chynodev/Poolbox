namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.panel()
    @Serenity.Decorators.responsive()
    export class WordInfoPanel extends Serenity.TemplatedPanel<any> {

        constructor(container: JQuery, options: WordInfoOptions) {
            super(container);
            this.element.addClass('flex-layout');
            this.element.removeClass('hidden');
            this.arrange();

            if (options.hideToolbar)
                this.toolbar.element.remove();
            this.setTitle(options.title ??'');
        }

        protected getToolbarButtons(): Serenity.ToolButton[] {
            return [
                {
                    title: 'Save',
                    cssClass: 'apply-changes-button',
                    separator: 'right'
                },
                {
                    title: 'Delete',
                    cssClass: 'delete-button'
                }
            ]
        }

        public setTitle(title: string) {
            this.element[0].querySelector('#word-name').innerHTML = title;
        }
    }

    interface WordInfoOptions {
        title: string;
        hideToolbar: boolean;
    }
}