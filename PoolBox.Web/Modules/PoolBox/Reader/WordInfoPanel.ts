namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.panel()
    @Serenity.Decorators.responsive()
    export class WordInfoPanel extends Serenity.TemplatedPanel<TranslationsRow> {
        protected elements: PageElements;
        protected form = new TranslationsForm(this.idPrefix);
        protected panelDialog: TranslationsPanelDialog;
        protected currentEntity: TranslationsRow;

        constructor(container: JQuery, options: WordInfoOptions) {
            super(container);
            this.element.addClass('flex-layout');
            this.element.removeClass('hidden');
            this.arrange();

            options.onDeleteGridAction ??= this.clearPanel.bind(this);

            this.elements = new PageElements();
            this.initPanelDialog(options);
            this.setTitle(options.title ?? '');
            this.elements.formContainer.append(this.panelDialog.element[0]);
            this.setAudioOnClickEvent();
        }

        protected initPanelDialog(options: WordInfoOptions) {
            this.panelDialog = new TranslationsPanelDialog(options);
        }

        public renderTranslation(translation: TranslationsRow) {
            this.loadByIdOrEntity(translation);
            this.currentEntity = translation;
            this.panelDialog.element.show();
            this.elements.audioContainer.style.visibility = 'visible';
        }

        protected playAudioRecording() {
            if (!this.currentEntity?.Translated)
                return;
            let self = this;
            CloudTranslationService.GetTextToSpeechRecording(
                {
                    Text: this.currentEntity.Translated
                },
                (resp) => {
                    if (!resp.Error?.Message) {
                        self.elements.audioRecording.src = 'data:audio/wav;base64,' + resp.audioCode;
                        self.elements.audioRecording.play();
                    }
                }
            );
        }

        protected setAudioOnClickEvent() {
            this.elements.audioContainer.addEventListener('click', this.playAudioRecording.bind(this));
        }

        public loadByIdOrEntity(entityOrId: number | TranslationsRow) {
            this.panelDialog.load(
                entityOrId,
                null,
                (ex) => { throw new Error(ex.message) }
            );
        }

        public clearPanel() {
            this.panelDialog.load(null, null, null);
            this.elements.audioContainer.style.visibility = 'hidden';
            this.panelDialog.element.hide();
        }

        public setTitle(title: string) {
            this.element[0].querySelector('#word-name').innerHTML = title;
        }
    }

    class PageElements {
        public wordType = document.querySelector('#word-type') as HTMLElement;
        public nounGender = document.querySelector('#noun-gender') as HTMLElement;
        public formContainer = document.querySelector('#form-container') as HTMLElement;
        public audioContainer = document.querySelector('#audio-recording-container') as HTMLElement;
        public audioRecording = document.querySelector('#audio-recording') as HTMLAudioElement;
    }

    export interface WordInfoOptions {
        title: string;
        hideToolbar: boolean;
        onDeleteGridAction: () => void;
        onSaveGridAction: (updatedCard: TranslationsRow) => void;
    }
}