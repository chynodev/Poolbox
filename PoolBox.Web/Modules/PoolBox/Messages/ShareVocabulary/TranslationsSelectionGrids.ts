
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionBaseGrid extends Serenity.EntityGrid<TranslationsRow, any> {
        protected getColumnsKey() { return 'PoolBox.TranslationsSelection'; }
        protected getDialogType() { return null; }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getInsertPermission() { return TranslationsRow.insertPermission; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getService() { return TranslationsService.baseUrl; }

        protected rowSelection: Serenity.GridRowSelectionMixin;
        protected confirmOnClickAction: (data: string | TranslationsRow[], vocabularyName: string) => void;
        protected dialog: TranslationsSelectionDialog

        constructor(container: JQuery, sendMessageFunction: (wordIds: string | {}[], vocabularyName: string) => void, dialog: TranslationsSelectionDialog) {
            super(container);

            this.confirmOnClickAction = sendMessageFunction;
            this.rowSelection = new Serenity.GridRowSelectionMixin(this);
            this.setStyles();
            this.dialog = dialog;
        }

        protected setStyles() {
            (document.querySelector('.s-TemplatedDialog') as HTMLElement).style.paddingLeft = '5px';
        }

        // -- override
        protected getColumns(): Slick.Column[] {
            var columns = super.getColumns();
            columns.unshift(Serenity.GridRowSelectionMixin.createSelectColumn(() => this.rowSelection));
            return columns;
        }
    }

    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionSenderGrid extends TranslationsSelectionBaseGrid {
        constructor(container: JQuery, sendMessageFunction: (wordIds: string) => void, dialog: TranslationsSelectionDialog) {
            super(container, sendMessageFunction, dialog);
        }
        // -- override
        protected getButtons(): Serenity.ToolButton[] {
            let self = this;
            let buttons: Serenity.ToolButton[] = [];
            buttons.push({
                title: 'Send selected words',
                onClick: () => {
                    self.confirmOnClickAction(self.rowSelection.getSelectedAsInt64().toString(), null);
                    self.dialog.dialogClose();
                },
                cssClass: 'mail-button'
            });

            return buttons;
        }
    }

    @Serenity.Decorators.registerClass()
    export class LibraryTranslationsSelectionSenderGrid extends TranslationsSelectionBaseGrid {
        constructor(container: JQuery, sendMessageFunction: (wordIds: string, vocabularyName: string) => void, dialog: TranslationsSelectionDialog) {
            super(container, sendMessageFunction, dialog);
            this.insertNameInputElementBeforeGrid();
        }

        protected insertNameInputElementBeforeGrid() {
            let formGroup = document.createElement('div');
            let nameLabel = document.createElement('label');
            let nameInput = document.createElement('input');

            nameInput.id = 'name-input';
            nameLabel.textContent = 'Name';

            formGroup.classList.add('form-group');
            nameLabel.setAttribute('for', 'name-input');
            nameInput.classList.add('form-control');
            nameInput.setAttribute('placeholder', 'Enter vocabulary name');

            formGroup.appendChild(nameLabel);
            formGroup.appendChild(nameInput);
            formGroup.style.maxWidth = '300px';
            formGroup.style.fontWeight = '600';

            this.element[0].insertBefore(formGroup, this.element[0].querySelector('.grid-toolbar'))
        }

        // -- override
        protected getButtons(): Serenity.ToolButton[] {
            let self = this;
            let buttons: Serenity.ToolButton[] = [];
            buttons.push({
                title: 'Upload selected words',
                onClick: () => {
                    self.confirmOnClickAction(self.rowSelection.getSelectedAsInt64().toString(), $('#name-input').val());
                    self.dialog.dialogClose();
                }
            });
            return buttons;
        }
    }

    @Serenity.Decorators.registerClass()
    export class TranslationsSelectionReceiverGrid extends TranslationsSelectionBaseGrid {

        protected myRows: TranslationsRow[] = [];

        constructor(container: JQuery, saveVocabulary: (wordIds: TranslationsRow[], kako: string) => void, rows: TranslationsRow[], dialog: TranslationsSelectionDialog) {
            super(container, saveVocabulary, dialog);

            this.myRows = rows;
            this.addLanguagePairToTittle();
        }

        protected addLanguagePairToTittle() {
            let pair = LanguagePairsRow.getLookup().itemById[this.myRows[0].PairId];

            this.setTitle(`Translations (${pair.TranslateTo} - ${pair.TranslateFrom})`);
        }

        protected onViewProcessData(response: Serenity.ListResponse<PoolBox.TranslationsRow>) {
            response.Entities = this.myRows;
            return super.onViewProcessData(response);
        }

        // -- override
        protected getButtons(): Serenity.ToolButton[] {
            let self = this;
            let buttons: Serenity.ToolButton[] = [];
            buttons.push({
                title: 'Save selected words',
                onClick: () => {
                    let selectedRows = self.myRows.filter(x => self.rowSelection.getSelectedAsInt64().indexOf(x.TrId) > -1);

                    self.confirmOnClickAction(selectedRows, null);
                    self.dialog.dialogClose();
                },
                cssClass: 'apply-changes-button'
            });

            return buttons;
        }
    }

}