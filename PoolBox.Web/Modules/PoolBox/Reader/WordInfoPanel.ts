namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.panel()
    @Serenity.Decorators.responsive()
    export class WordInfoPanel extends Serenity.TemplatedPanel<TranslationsRow> {
        protected elements: PageElements;
        protected form = new TranslationsForm(this.idPrefix);
        protected panelDialog: TranslationsPanelDialog;
        protected currentEntity: TranslationsRow;
        protected dictionaryUrl: string;

        constructor(container: JQuery, options: WordInfoOptions) {
            super(container);
            this.element.addClass('flex-layout');
            this.element.removeClass('hidden');
            this.arrange();
            this.dictionaryUrl = this.getDictionaryUrl();

            if (!options.onDeleteGridAction)
                options.onDeleteGridAction = this.clearPanel.bind(this);

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
            this.elements.iFrameDictionary.style.visibility = 'visible';
            this.updateDictionary(translation.Original);
        }

        protected playAudioRecording() {
            if (!this.currentEntity?.Original)
                return;
            let self = this;
            CloudTranslationService.GetTextToSpeechRecording(
                {
                    Text: this.currentEntity.Original
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
            this.elements.iFrameDictionary.style.visibility = 'hidden';
        }

        public setTitle(title: string) {
            this.element[0].querySelector('#word-name').innerHTML = title;
        }

        protected updateDictionary(word: string) {
            this.elements.iFrameDictionary.src = this.dictionaryUrl + word;
        }

        protected getDictionaryUrl() {
            let dictionaryUrls = {
                ES: 'https://www.wordreference.com/definicion/',
                EN: 'https://www.dictionary.com/browse/',
                DE: 'https://www.dwds.de/wb/',
                PT: 'https://www.dicio.com.br/',
                SK: 'https://slovnik.aktuality.sk/pravopis/slovnik-sj/?q=',
                CS: 'https://www.nechybujte.cz/slovnik-soucasne-cestiny/',
                IT: 'https://www.wordreference.com/definizione/'
            };

            let languageCode = LanguagePairsRow.getLookup().itemById[
                parseInt(new Common.LanguagePairPreference().getItem())
            ].TranslateFrom;

            let url = dictionaryUrls[languageCode];

            return url;
        }

    }

    class PageElements {
        public wordType = document.querySelector('#word-type') as HTMLElement;
        public nounGender = document.querySelector('#noun-gender') as HTMLElement;
        public formContainer = document.querySelector('#form-container') as HTMLElement;
        public audioContainer = document.querySelector('#audio-recording-container') as HTMLElement;
        public audioRecording = document.querySelector('#audio-recording') as HTMLAudioElement;
        public iFrameDictionary = document.querySelector('#dictionary-iframe') as HTMLIFrameElement;
    }
    
    export interface WordInfoOptions {
        title: string;
        hideToolbar: boolean;
        onDeleteGridAction: () => void;
        onSaveGridAction: (updatedCard: TranslationsRow) => void;
    }
}