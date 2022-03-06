namespace PoolBox.PoolBox {
    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionDialog extends Serenity.TemplatedDialog<any> {

        protected grid: TranslationsSelectionGrid;

        constructor(sendMessageFunction: (wordIds: string) => void) {
            super();

            this.grid = new TranslationsSelectionGrid(this.element, sendMessageFunction);
        }


        protected getDialogTitle() {
            return "Select translations";
        }

    }
}