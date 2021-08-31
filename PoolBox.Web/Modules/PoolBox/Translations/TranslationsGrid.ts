
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class TranslationsGrid extends Serenity.EntityGrid<TranslationsRow, any> {
        protected getColumnsKey() { return 'PoolBox.Translations'; }
        protected getDialogType() { return this.isImportMode ? TranslationsInMemoryDialog : TranslationsDialog }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getInsertPermission() { return TranslationsRow.insertPermission; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getService() { return TranslationsService.baseUrl; }

        protected clipboardText: string;
        protected pastedRows: TranslationsRow[];
        protected elements: PageElements;
        protected isImportMode: boolean = false;
        protected errorColumn: Slick.Column;

        constructor(container: JQuery) {
            super(container);

            let currentLng = new Common.LanguagePairPreference().getItem();
            this.addPasteFromClipboardEventListener();
        }

        protected addPasteFromClipboardEventListener() {
            let _this = this;
            window.addEventListener("paste", e => {
                this.clipboardText = (<ClipboardEvent>e).clipboardData.getData('Text');

                TranslationsService.CSVClipboardFormatAndCheck({
                    ClipboardText: _this.clipboardText
                },
                    (response) => {
                        this.pastedRows = response.Entities;
                        this.pasteRowsOntoGrid(this.pastedRows);
                    }
                );

            }, false)
        }

        protected activateImportMode() {
            this.isImportMode = true;
            My.hideHtmlElement(this.elements.saveButton);
            My.disableHtmlElement(this.elements.searchBar);
            My.disableHtmlElement(this.elements.columnsBar);
            My.hideHtmlElement(this.elements.addButton);
            My.showHtmlElement(this.elements.importButton);
            this.setTitle('Translations - Import mode');
            this.elements.refreshButton.classList.remove('refresh-button');
            this.elements.refreshButton.classList.add('back-button');
        }

        protected deactivateImportMode() {
            this.isImportMode = false;
            My.showHtmlElement(this.elements.saveButton);
            My.enableHtmlElement(this.elements.searchBar);
            My.enableHtmlElement(this.elements.columnsBar);
            My.showHtmlElement(this.elements.addButton);
            My.hideHtmlElement(this.elements.importButton);
            this.setTitle('Translations');
            this.elements.refreshButton.classList.remove('back-button');
            this.elements.refreshButton.classList.add('refresh-button');
            this.hideErrorColumn();
        }

        protected pasteRowsOntoGrid(rows: TranslationsRow[]) {
            this.assignTemporaryIdToPastedRows(rows);

            this.view.setItems(
                this.isImportMode ? this.view.getItems().concat(rows) : rows
            );

            if (!this.isImportMode)
                this.activateImportMode();
        }

        protected assignTemporaryIdToPastedRows(rows: TranslationsRow[]) {
            let startId = 0;

            if (this.isImportMode && this.view.getItems().length > 0) {
                startId = this.view.getItems()
                    .reduce((previous, current) => previous < current ? previous : current).TrId;
            } 

            rows.forEach(row => row.TrId = --startId);
        }

        // -- override
        protected getButtons(): Serenity.ToolButton[] {
            let buttons = super.getButtons().filter(x => x.cssClass != 'column-picker-button');

            buttons.push({
                title: 'Import',
                cssClass: 'apply-changes-button',
                visible: false,
                onClick: (e) => {
                    this.importTranslations(this.view.getItems());
                }
            });
            buttons.push({
                title: 'Upload file',
                cssClass: 'export-csv-button',
                onClick: () => {
                    var dialog = new TranslationsFileImportDialog(
                        TranslationsService.CSVFileFormatAndCheck,
                        this.pasteRowsOntoGrid.bind(this)
                    );
                    dialog.dialogOpen();
                }
            });
            
            return buttons;
        }

        // -- override
        protected editItem(entityOrId: any): void {

            if (!this.isImportMode) {
                super.editItem(entityOrId);
                return;
            }

            var item = this.view.getItemById(entityOrId);
            this.createEntityDialog(this.getItemType(), dlg => {
                var dialog = dlg as Common.GridEditorDialog<TranslationsRow>;
                dialog.onDelete = (opt, callback) => {
                    this.deleteRow(item.TrId)
                    dialog.dialogClose();
                };
                this.transferDialogReadOnly(dialog);
                dialog.onSave = (opt, callback) => {
                    item.Error = null;
                    this.save(opt);
                    dialog.dialogClose();
                };
                dialog.loadEntityAndOpenDialog(item);
            });
        }

        protected save(opt: Serenity.ServiceOptions<any>) {
            var request = opt.request as Serenity.SaveRequest<TranslationsRow>;
            var row = request.Entity;

            var items = this.view.getItems();
            var index = Q.indexOf(items, x => x.TrId == row.TrId);

            items[index] = Q.deepClone({} as TranslationsRow, items[index], row);
            this.view.setItems([]);
            this.assignTemporaryIdToPastedRows(items);
            this.setItems(items);
        }

        protected deleteRow(entityOrId: number | TranslationsRow) {
            let id = typeof (entityOrId) != 'number' ? (entityOrId as TranslationsRow).TrId : entityOrId;

            if (this.isImportMode)
                this.view.setItems(this.view.getItems().filter(x => x.TrId != id))
            else
                TranslationsService.Delete(
                    { EntityId: id },
                    () => { this.refresh(); }
                );
        }

        protected importTranslations(rows: TranslationsRow[]) {
            let errorRows = [];
            rows.forEach(row => {
                TranslationsService.Import(
                    { Entity: row },
                    (response) => {
                        if (response.Entity.Error) {
                            row.Error = response.Entity.Error;
                            errorRows.push(row);
                        }
                    },
                    { async: false }
                )
            });
            Q.notifySuccess(
                'Successfully imported ' +
                (rows.length - errorRows.length == rows.length ? ' all' : (rows.length - errorRows.length) + ' out of ' + rows.length)
                + ' rows.',
                null,
                { timeOut: 3000 }
            );

            if (errorRows) {
                this.showErrorColumn();
                this.view.setItems(errorRows);
            } else {
                this.refresh();
            }
        }

        // -- override
        protected getColumns() {
            var columns = super.getColumns();

            columns.unshift({
                field: 'Delete Row',
                name: '',
                format: ctx => '<a class="inline-action delete-row" title="delete">' +
                    '<i class="fa fa-trash-o text-red"></i></a>',
                width: 24,
                minWidth: 24,
                maxWidth: 24
            });

            this.errorColumn = Q.first(columns, x => x.field == 'Error');

            return columns;
        }

        protected showErrorColumn() {
            var cols = this.slickGrid.getColumns();
            cols.push(this.errorColumn);
            this.slickGrid.setColumns(cols);
        }

        protected hideErrorColumn() {
            var columns = this.slickGrid.getColumns();
            let cols = columns.filter(x => x.name != 'Error');
            this.slickGrid.setColumns(cols);
        }

        protected onViewProcessData(response: Serenity.ListResponse<PoolBox.TranslationsRow>) {
            this.deactivateImportMode();

            return super.onViewProcessData(response);
        }

        // -- override
        protected onClick(e: JQueryEventObject, row: number, cell: number) {
            super.onClick(e, row, cell);

            if (e.isDefaultPrevented())
                return;

            var item = this.itemAt(row);
            var target = $(e.target);

            // if user clicks "i" element, e.g. icon
            if (target.parent().hasClass('inline-action'))
                target = target.parent();

            if (target.hasClass('inline-action')) {
                e.preventDefault();
                
                if (target.hasClass('delete-row')) {
                    this.deleteRow(item.TrId)
                }
            }
        }

        // -- override
        protected createToolbarExtensions() {
            super.createToolbarExtensions();
            this.elements = new PageElements();
        }

    }

    class PageElements {
        public refreshButton = document.querySelector('.refresh-button') as HTMLElement;
        public saveButton = document.querySelector('.apply-changes-button') as HTMLElement;
        public searchBar = document.querySelector('.s-QuickSearchInput') as HTMLInputElement;
        public filtersBar = document.querySelector('.quick-filters-bar.s-QuickFilterBar') as HTMLElement;
        public columnsBar = document.querySelector('.slick-pane.slick-pane-header') as HTMLElement;
        public addButton = document.querySelector('.add-button') as HTMLElement;
        public importButton = document.querySelector('.apply-changes-button') as HTMLElement;
        public uploadCsvFileButton = document.querySelector('.export-csv-button') as HTMLElement;
    }

}