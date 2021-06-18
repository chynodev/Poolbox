namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.panel()
    @Serenity.Decorators.responsive()
    export class WordInfoPanel extends Serenity.TemplatedPanel<any> {

        private saved = true;
        private updated = false;

        constructor(container: JQuery) {
            super(container);
            this.element.addClass('flex-layout');
            this.element.removeClass('hidden'); //.appendTo('#DialogDiv');
            this.arrange();
        }
    }
}