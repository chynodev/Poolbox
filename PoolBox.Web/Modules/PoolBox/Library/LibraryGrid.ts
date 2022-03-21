
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class LibraryGrid extends Serenity.EntityGrid<MessagesRow, any> {
        protected getColumnsKey() { return 'PoolBox.Library'; }
        protected getIdProperty() { return MessagesRow.idProperty; }
        protected getInsertPermission() { return MessagesRow.insertPermission; }
        protected getLocalTextPrefix() { return MessagesRow.localTextPrefix; }
        protected getService() { return LibraryService.baseUrl; }

        protected readonly hubMethods = {
            joinGroup: 'AddUserToGroupAsync',
            uploadVocabulary: 'UploadVocabulary',
            updateLibraryFeed: 'UpdateLibraryFeed'
        };

        constructor(container: JQuery) {
            super(container);

            this.setTitle("Vocabulary library");
            this.setEvents();
        }

        protected setEvents() {
            this.setUpdateLibraryFeedAction();
        }

        protected uploadVocabulary(wordIds: string, vocabularyName: string) {
            if (!wordIds)
                return;

            let content = `${vocabularyName}-${wordIds}`;

            connection
                .invoke(this.hubMethods.uploadVocabulary, content)
                .catch(err => console.error(err.toString()));
        }

        protected setUpdateLibraryFeedAction() {
            let self = this;

            connection.on(this.hubMethods.updateLibraryFeed, () => {
                self.refresh();
            });
        }

        protected getButtons(): Serenity.ToolButton[] {
            let buttons = super.getButtons();
            let addBtn = buttons.filter(x => x.cssClass == 'add-button')[0];
            addBtn.onClick = this.setSendVocabularyBtnOnClickAction.bind(this);
            addBtn.title = 'Upload vocabulary';

            return buttons;
        }

        protected setSendVocabularyBtnOnClickAction() {
            let dlg = new TranslationsSelectionDialog(this.uploadVocabulary.bind(this), true, null, true);
            dlg.init();
            dlg.dialogOpen();
        }

        // --override
        protected editItem(entityOrId: any): void {
            const saveReceivedVocabulary =
                (translations: TranslationsRow[]) => TranslationsService.SaveReceivedVocabulary({ Entities: translations });

            let vocabularyIds = this.getItems().filter(x => x.Id == entityOrId)[0].Content.trim();

            let dlg = new TranslationsSelectionDialog(
                saveReceivedVocabulary.bind(this),
                false,
                vocabularyIds
            );
            dlg.init();
            dlg.dialogOpen();
        }
    }
}