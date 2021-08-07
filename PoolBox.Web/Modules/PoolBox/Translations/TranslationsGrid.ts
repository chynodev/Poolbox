﻿
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class TranslationsGrid extends Serenity.EntityGrid<TranslationsRow, any> {
        protected getColumnsKey() { return 'PoolBox.Translations'; }
        protected getDialogType() { return TranslationsDialog; }
        protected getIdProperty() { return TranslationsRow.idProperty; }
        protected getInsertPermission() { return TranslationsRow.insertPermission; }
        protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        protected getService() { return TranslationsService.baseUrl; }

        constructor(container: JQuery) {
            super(container);

            let currentLng = new Common.LanguagePairPreference().getItem();
        }


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

            return columns;
        }

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
                    TranslationsService.Delete(
                        { EntityId: item.TrId },
                        () => { this.refresh(); }
                    );
                }
            }
        }
    }
}