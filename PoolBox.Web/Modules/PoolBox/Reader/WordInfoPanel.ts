namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.panel()
    @Serenity.Decorators.responsive()
    export class WordInfoPanel extends Serenity.TemplatedPanel<any> {

        protected elements: PageElements;

        constructor(container: JQuery, options: WordInfoOptions) {
            super(container);
            this.element.addClass('flex-layout');
            this.element.removeClass('hidden');
            this.arrange();

            if (options.hideToolbar)
                this.toolbar.element.remove();
            this.setTitle(options.title ?? '');

            this.elements = new PageElements();
        }

        public renderTranslation(translation: TranslationsRow) {
            this.elements.nounGender.innerHTML = translation.NounGender ?? '';
            this.elements.wordType.innerHTML = translation.WordType ?? '';
        }

        public clearPanel() {
            this.elements.nounGender.innerHTML = '';
            this.elements.wordType.innerHTML = '';
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

    class PageElements {
        public wordType = document.querySelector('#word-type') as HTMLElement;
        public nounGender = document.querySelector('#noun-gender') as HTMLElement;
    }

    interface WordInfoOptions {
        title: string;
        hideToolbar: boolean;
    }
}