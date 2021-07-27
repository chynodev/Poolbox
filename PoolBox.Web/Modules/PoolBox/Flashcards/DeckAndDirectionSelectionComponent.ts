namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    @Serenity.Decorators.responsive()
    export class DeckSizeSelectionComponent extends Serenity.TemplatedWidget<any> {

        protected passSelectionToGridFunction: PassSelectionToGridFunction;
        protected continueBtn: HTMLElement;
        protected elements: PageElements;
        protected selectedWordCount: number;
        protected selectedCardDirection: FlashcardDirection;

        constructor(container: JQuery, passSelectionToGridFunction: PassSelectionToGridFunction) {
            super(container);
            this.element.addClass('flex-layout');
            this.element.removeClass('hidden');
            this.passSelectionToGridFunction = passSelectionToGridFunction;
            this.elements = new PageElements();
            this.setButtonsOnClickEvents();
        }

        protected setButtonsOnClickEvents() {
            let self = this;
            // continue btn
            this.elements.continueBtn.addEventListener('click', () => {
                if(!self.selectedCardDirection || !self.selectedWordCount)
                    return;

                // -- component sends seleted data to grid and destroys itself after clicking 'continue' button
                this.element.remove();
                self.passSelectionToGridFunction(self.selectedWordCount, self.selectedCardDirection);
            })

            // deck size options
            this.elements.deckOptionBtns.forEach(option => {
                option.addEventListener('click', () => {
                    this.elements.deckOptionBtns.forEach(item => {
                        if (item.classList.contains('selected'))
                            item.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    self.selectedWordCount = parseInt(option.dataset.wordCount);
                })
            });

            // direction of displaying flashcards options
            this.elements.directionOptionBtns.forEach(option => {
                option.addEventListener('click', () => {
                    this.elements.directionOptionBtns.forEach(item => {
                        if (item.classList.contains('selected'))
                            item.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    self.selectedCardDirection = parseInt(option.dataset.cardDirection);
                })
            });

        }
    }

    interface PassSelectionToGridFunction {
        (deckSize: number, direction: FlashcardDirection): void;
    }

    export enum FlashcardDirection {
        Standard = 1,
        Reversed = 2,
        Bidirectional = 3
    }

    class PageElements {
        public continueBtn = document.querySelector('#continue-btn') as HTMLElement;
        public deckOptionBtns: HTMLElement[] = [];
        public directionOptionBtns: HTMLElement[] = [];

        constructor() {
            this.populateDeckOptionsBtns();
            this.populateDirectionOptionsBtns();
        }

        private populateDeckOptionsBtns() {
            document.querySelectorAll('.select-option.deck-option').forEach(option => {
                this.deckOptionBtns.push(option as HTMLElement);
            });
        }

        private populateDirectionOptionsBtns() {
            document.querySelectorAll('.select-option.direction-option').forEach(option => {
                this.directionOptionBtns.push(option as HTMLElement);
            });
        }
    }
}