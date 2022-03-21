namespace PoolBox.PoolBox {
    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionDialog extends Serenity.TemplatedDialog<any> {

        public grid: TranslationsSelectionBaseGrid;
        protected isSender: boolean;
        isLibrary: boolean;

        constructor(
            sendMessageFunction: (data: string | TranslationsRow[]) => void,
            isSender: boolean = true,
            translationsIds: string = null,
            isLibrary: boolean = false)
        {
            super();
            this.element[0].style.minHeight = '600px';
            this.isLibrary = isLibrary;

            if (isSender)
                this.grid = this.isLibrary
                    ? new LibraryTranslationsSelectionSenderGrid(this.element, sendMessageFunction, this)
                    : new TranslationsSelectionSenderGrid(this.element, sendMessageFunction, this);
            else
                this.grid = new TranslationsSelectionReceiverGrid(this.element, sendMessageFunction, this.fetchTranslations(translationsIds), this);
        }

        protected fetchTranslations(translationsIds: string) {
            if (translationsIds.indexOf('-') > -1)
                translationsIds = translationsIds.split('-')[1];

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