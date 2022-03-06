namespace PoolBox.PoolBox {
    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionDialog extends Serenity.TemplatedDialog<any> {

        protected grid: TranslationsSelectionGrid;

        constructor() {
            super();

            this.grid = new TranslationsSelectionGrid(this.element);
        }


        protected getDialogTitle() {
            return "Select translations";
        }

    }
}