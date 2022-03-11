namespace PoolBox.PoolBox {
    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionDialog extends Serenity.TemplatedDialog<any> {

        public grid: TranslationsSelectionBaseGrid;
        protected isSender: boolean;

        constructor(sendMessageFunction: (data: string | TranslationsRow[]) => void, isSender: boolean = true, translationsIds: string = null) {
            super();
            
            if (isSender)
                this.grid = new TranslationsSelectionSenderGrid(this.element, sendMessageFunction, this);
            else
                this.grid = new TranslationsSelectionReceiverGrid(this.element, sendMessageFunction, this.fetchTranslations(translationsIds), this);
        }

        protected fetchTranslations(translationsIds: string) {
            let ids = translationsIds.split(',');
            ids.forEach((x, idx) => ids[idx] = x.trim());

            var items = TranslationsRow.getLookup().items.filter(x => ids.indexOf(x.TrId.toString()) > -1);
            return items;
        }

        protected getDialogTitle() {
            return 'Select translations';
        }

    }
}