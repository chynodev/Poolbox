
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class FlashcardsGrid extends Serenity.EntityGrid<TranslationsRow, any> {
        //protected getColumnsKey() { return 'PoolBox.Flashcards'; }
        //protected getDialogType() { return TranslationsDialog; }
        //protected getIdProperty() { return TranslationsRow.idProperty; }
        //protected getInsertPermission() { return TranslationsRow.insertPermission; }
        //protected getLocalTextPrefix() { return TranslationsRow.localTextPrefix; }
        //protected getService() { return TranslationsService.baseUrl; }

        protected elements: PageElements;
        protected selectedDeckSize: number;
        protected selectedFlashcardDirection: FlashcardDirection;
        protected wordInfoPanel: WordInfoPanel;
        protected cardDeck: TranslationsRow[];
        protected languagePairId: number;

        constructor(container: JQuery) {
            super(container);

            this.setTitle('Flashcards');
            this.slickGrid.destroy();
            this.languagePairId = parseInt(new Common.LanguagePairPreference().getItem());
            this.elements = new PageElements();
            this.initWordInfoPanel();
            this.initDeckSizeSelectionComponent();
            this.elements.grid.appendChild(this.elements.flashcardsAndPanel);
            this.elements.grid.appendChild(this.elements.deckSizeSelectionPage.element[0]);
            this.setButtonsOnClickEvents();
        }

        protected initDeckSizeSelectionComponent() {
            this.elements.deckSizeSelectionPage = new DeckSizeSelectionComponent(
                $('#DeckSizeSelection'),
                ((deckSize: number, direction: FlashcardDirection) => {
                    this.selectedDeckSize = deckSize;
                    this.selectedFlashcardDirection = direction;
                    this.elements.flashcardsAndPanel.style.display = 'block';
                    this.fetchCardDeck();
                }).bind(this)
            );
        }

        protected initWordInfoPanel() {
            this.wordInfoPanel = new WordInfoPanel(
                $('#word-info-panel'),
                { hideToolbar: false, title: 'Edit translation' }
            );
        }

        protected fetchCardDeck() {
            var req: Serenity.ListRequest = {
                Take: this.selectedDeckSize,
                Criteria: Serenity.Criteria.and(
                    [[TranslationsRow.Fields.Username], '=', Authorization.userDefinition.Username],
                    [[TranslationsRow.Fields.PairId], '=', this.languagePairId],
                    [[TranslationsRow.Fields.DueDate], '<=', new Date()]
                )
            }
            TranslationsService.List(
                req,
                (response) => this.cardDeck = response.Entities
            );
        }

        protected setButtonsOnClickEvents() {
            this.elements.showTranslationBtn.addEventListener('click', () => {
                this.showTranslation();
            })

            // -- BAD option
            this.elements.badOptionBtn.addEventListener('click', () => {
                // DO STUFF
            })

            // -- MEDIUM option
            this.elements.mediumOptionBtn.addEventListener('click', () => {
                // DO STUFF
            })

            // -- GOOD option
            this.elements.goodOptionBtn.addEventListener('click', () => {
                // DO STUFF
            })
        }

        // --override
        protected createQuickSearchInput(): void {
         
        }

        // --override
        protected createToolbar(buttons: Serenity.ToolButton[]): void {
            
        }

        // override
        protected usePager() {
            return false;
        }

        protected showTranslation() {
            this.elements.recalBtns.style.visibility = 'visible';
            this.elements.translatedWord.style.visibility = 'visible';
            this.elements.showTranslationBtn.style.visibility = 'hidden';
        }
    }

    class PageElements {
        public wordPanel = document.querySelector('#word-info-panel') as HTMLElement;
        public flashcardsAndPanel = document.querySelector('#flashcards-panel-container') as HTMLElement;
        public wordName = document.querySelector('#word-name') as HTMLElement;
        public grid = document.querySelector('.grid-container') as HTMLElement;
        public translatedWord = document.querySelector('#translated-word-wrapper') as HTMLElement;
        public recalBtns = document.querySelector('#recall-btns-container') as HTMLElement;
        public showTranslationBtn = document.querySelector('#show-translation-btn') as HTMLElement;
        public badOptionBtn = document.querySelector('#bad-btn') as HTMLElement;
        public mediumOptionBtn = document.querySelector('#medium-btn') as HTMLElement;
        public goodOptionBtn = document.querySelector('#good-btn') as HTMLElement;
        public deckSizeSelectionPage: DeckSizeSelectionComponent;
    }
}