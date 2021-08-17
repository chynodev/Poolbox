
namespace PoolBox.PoolBox {
    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.responsive()
    export class TranslationsFileImportDialog extends Serenity.PropertyDialog<any, any> {

        protected form = new TranslationsFileImportForm(this.idPrefix);

        protected fileFormatAndCheckHandler:
            (
                request: Requests.FileFormatRequest,
                onSuccess?: (response: Serenity.ListResponse<TranslationsRow>) => void,
                opt?: Q.ServiceOptions<any>
            ) => JQueryXHR;

        protected formatAndCheckResponseHandler:
            (
                response: TranslationsRow[]
            ) => void;

        constructor(
            fileFormatAndCheckHandler: (
                request: Requests.FileFormatRequest,
                onSuccess?: (response: Serenity.ListResponse<TranslationsRow>) => void,
                opt?: Q.ServiceOptions<any>
            ) => JQueryXHR,

            formatAndCheckResponseHandler: (response: TranslationsRow[]) => void
        ) {
            super();
            this.fileFormatAndCheckHandler = fileFormatAndCheckHandler;
            this.formatAndCheckResponseHandler = formatAndCheckResponseHandler;
        }

        protected getDialogTitle(): string {
            return 'Select ".csv" file';
        }

        protected getDialogButtons() {
            return [
                {
                    text: 'Import',
                    click: () => {
                        if (!this.validateBeforeSave())
                            return;
                        console.info("uploadfileName" + this.form.FileName.value);
                        if (this.form.FileName.value == null ||
                            Q.isEmptyOrNull(this.form.FileName.value.Filename)) {
                            Q.notifyError(
                                "Please select a file",
                                null,
                                { tapToDismiss: true, timeOut: 0, closeOnHover: false, extendedTimeOut: 0 }
                            );
                            return;
                        }
                        this.fileFormatAndCheckHandler(
                            {
                                FileName: this.form.FileName.value.Filename
                            }
                            , response => {
                                this.formatAndCheckResponseHandler(response.Entities);
                            }
                            , {
                                async: true,
                                onError: (response: Serenity.ServiceResponse) => Q.notifyError(response.Error.Message, response.Error.Code, { timeOut: 0, extendedTimeOut: 0, tapToDismiss: true })
                            }
                        );
                        Q.blockUndo();
                        this.dialogClose();
                    },
                },
                {
                    text: 'Cancel',
                    click: () => this.dialogClose()
                }
            ];
        }
    }
}