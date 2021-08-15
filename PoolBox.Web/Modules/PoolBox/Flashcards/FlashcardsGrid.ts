
namespace PoolBox.PoolBox {
    @Serenity.Decorators.registerClass()
    export class FlashcardsGrid extends Common.GridEditorBase<TranslationsRow> {
        protected elements: PageElements;
        protected selectedDeckSize: number;
        protected selectedFlashcardDirection: FlashcardDirection;
        protected wordInfoPanel: WordInfoPanel;
        protected cardDeck: TranslationsRow[];
        protected reviewedCards: TranslationsRow[] = [];
        protected languagePairId: number;
        protected activeCard: TranslationsRow;

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
                {
                    hideToolbar: false,
                    title: 'Edit translation',
                    onDeleteGridAction: this.nextCard.bind(this),
                    onSaveGridAction: this.updateCardOriginalAndTranslation.bind(this)
                }
            );
        }

        protected processResponseQuality(quality: Requests.ResponseQuality) {
            var req: Requests.FlashcardsResponseQualityRequest = {
                Quality: quality,
                Translation: this.activeCard
            };
            
            FlashcardsService.ProcessResponseQuality(
                req,
                (response) => My.mapObject(response.Row, this.activeCard),
                { async: false }
            );
        }

        protected nextCard(quality: Requests.ResponseQuality = null) {
            if(quality)
                this.processResponseQuality(quality);

            let idx = this.cardDeck.indexOf(this.activeCard);
            let previousCard = this.activeCard;

            if (idx == this.cardDeck.length - 1)
                this.displayCard(this.cardDeck[0])
            else 
                this.displayCard(this.cardDeck[idx + 1]);

            if (quality != Requests.ResponseQuality.Bad) {
                if(quality)
                    this.reviewedCards.push(previousCard);
                this.cardDeck.splice(idx, 1);
            }
            this.hideTranslation();

            if (this.cardDeck.length == 0) 
                this.displayReviewedCards();
        }

        protected displayReviewedCards() {
            this.removeFlashCardsComponents();
            
            this.elements.flashcardsContainer.style.display = 'flex';
            this.elements.flashcardsContainer.style.justifyContent = 'center';

            this.reviewedCards.forEach(card => {
                this.addReviewedWordToTableElement(card);
            });

            this.elements.flashcardsContainer.append(this.elements.reviewedCardListContainer);
            this.elements.reviewedCardListContainer.style.display = 'block';
        }

        protected addReviewedWordToTableElement(card: TranslationsRow) {
            let ogReviewedWordRow = this.elements.reviewedCardList.querySelector('.reviewed-word-row');

            let newReviewedWordRow = ogReviewedWordRow.cloneNode(true);
            (<HTMLElement>newReviewedWordRow).querySelector('.reviewed-word').innerHTML = card.Original;
            (<HTMLElement>newReviewedWordRow).querySelector('.due-in').innerHTML = card.Interval + ' day' + (card.Interval > 1 ? 's' : '');
            this.elements.reviewedCardList.append(newReviewedWordRow);
        }

        protected removeFlashCardsComponents() {
            while (this.elements.flashcardsContainer.childNodes.length != 0) {
                this.elements.flashcardsContainer.childNodes[0].remove();
            }
        }

        protected displayCard(card: TranslationsRow) {
            this.activeCard = card;
            this.elements.originalWord.innerHTML = card.Original;
            this.elements.translatedWord.innerHTML = card.Translated;
        }

        protected areAllRepeated() {
            return this.cardDeck.every(x => x.IsRepeated == true);
        }

        protected fetchCardDeck() {
            let date = new Date();
            // GMT + 2 midnight 
            date.setHours(26, 0, 0, 0);

            var req: Serenity.ListRequest = {
                Take: this.selectedDeckSize,
                Criteria: Serenity.Criteria.and(
                    [[TranslationsRow.Fields.Username], '=', Authorization.userDefinition.Username],
                    [[TranslationsRow.Fields.PairId], '=', this.languagePairId],
                    [[TranslationsRow.Fields.DueDate], '<=', date]
                ),
                Sort: [TranslationsRow.Fields.DueDate + ' DESC']
            }

            TranslationsService.List(
                req,
                (response) => {
                    this.cardDeck = response.Entities

                    if (this.isDeckEmpty())
                        this.elements.originalWord.innerHTML = "You don't have any cards scheduled for today";
                    else {
                        let middleCard = this.cardDeck[parseInt((this.cardDeck.length / 2).toString())]
                        this.displayCard(middleCard);
                    }
                }
            );
        }

        protected setButtonsOnClickEvents() {
            this.elements.showTranslationBtn.addEventListener('click', () => {
                this.showTranslation();
            })

            // -- BAD option
            this.elements.badOptionBtn.addEventListener('click', () => {
                this.nextCard(Requests.ResponseQuality.Bad);
            })

            // -- GOOD option
            this.elements.goodOptionBtn.addEventListener('click', () => {
                this.nextCard(Requests.ResponseQuality.Good);
            })

            // -- EASY option
            this.elements.easyOptionBtn.addEventListener('click', () => {
                this.nextCard(Requests.ResponseQuality.Easy);
            })
        }

        protected showTranslation() {
            this.elements.recalBtns.style.visibility = 'visible';
            this.elements.translatedWord.style.visibility = 'visible';
            this.elements.showTranslationBtn.style.visibility = 'hidden';
            this.wordInfoPanel.renderTranslation(this.activeCard);
        }

        protected hideTranslation() {
            this.elements.recalBtns.style.visibility = 'hidden';
            this.elements.translatedWord.style.visibility = 'hidden';
            this.elements.showTranslationBtn.style.visibility = 'visible';
            this.wordInfoPanel.clearPanel();
        }

        protected isDeckEmpty() {
            return this.cardDeck.length == 0;
        }

        protected updateCardOriginalAndTranslation(updatedCard: TranslationsRow) {
            My.mapObject(updatedCard, this.activeCard);
            this.displayCard(this.activeCard);
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

    }

    class PageElements {
        public wordPanel = document.querySelector('#word-info-panel') as HTMLElement;
        public flashcardsAndPanel = document.querySelector('#flashcards-panel-container') as HTMLElement;
        public flashcardsContainer = document.querySelector('#flashcards-wrapper') as HTMLElement;
        public reviewedCardList = document.querySelector('#reviewed-cards-list') as HTMLElement;
        public reviewedCardListContainer = document.querySelector('#reviewed-cards-list-container') as HTMLElement;
        public wordName = document.querySelector('#word-name') as HTMLElement;
        public grid = document.querySelector('.grid-container') as HTMLElement;
        public translatedWord = document.querySelector('#translated-word-wrapper') as HTMLElement;
        public originalWord = document.querySelector('#original-word-wrapper') as HTMLElement;
        public recalBtns = document.querySelector('#recall-btns-container') as HTMLElement;
        public showTranslationBtn = document.querySelector('#show-translation-btn') as HTMLElement;
        public badOptionBtn = document.querySelector('#bad-btn') as HTMLElement;
        public goodOptionBtn = document.querySelector('#good-btn') as HTMLElement;
        public easyOptionBtn = document.querySelector('#easy-btn') as HTMLElement;
        public deckSizeSelectionPage: DeckSizeSelectionComponent;
    }

}