namespace PoolBox.PoolBox {
    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.responsive()
    export class FileImportDialog extends Serenity.PropertyDialog<any, any> {

        protected form = new PoolBox.FileImportForm(this.idPrefix);

        protected fileFormatHandler: fileFormatHandler;
        protected fileFormatResponseHandler: fileFormatAndResponseHandler;

        constructor(fileFormatAndCheckHandler: fileFormatHandler, formatAndCheckResponseHandler: fileFormatAndResponseHandler) {
            super();

            this.fileFormatHandler = fileFormatAndCheckHandler;
            this.fileFormatResponseHandler = formatAndCheckResponseHandler;
        }

        protected getDialogTitle(): string {
            return "File Import";
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
                            Q.notifyError("Please select a file");
                            return;
                        }
                        this.fileFormatHandler(
                            {
                                FileName: this.form.FileName.value.Filename,
                            }
                            , this.fileFormatResponseHandler
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
    interface fileFormatHandler {
        (request: Requests.FileImportRequest,
        onSuccess?: fileFormatAndResponseHandler,
            opt?: Q.ServiceOptions<any>): Responses.FileImportResponse;
    }

    interface fileFormatAndResponseHandler {
        (response: Responses.FileImportResponse): void;
    }
}