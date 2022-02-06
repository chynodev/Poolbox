
namespace PoolBox.PoolBox {

    @Serenity.Decorators.registerClass()
    export class MessagesGrid extends Serenity.EntityGrid<MessagesRow, any> {
        protected getColumnsKey() { return 'PoolBox.Messages'; }
        protected getDialogType() { return MessagesDialog; }
        protected getIdProperty() { return MessagesRow.idProperty; }
        protected getInsertPermission() { return MessagesRow.insertPermission; }
        protected getLocalTextPrefix() { return MessagesRow.localTextPrefix; }
        protected getService() { return MessagesService.baseUrl; }

        protected elements: PageElements;
        protected users: Administration.UserRow[];

        constructor(container: JQuery) {
            super(container);

            this.slickGrid.destroy();
            this.elements = new PageElements();
            this.elements.grid.appendChild(this.elements.chatContainer);
            this.setTitle("Inbox");
            this.users = Administration.UserRow.getLookup().items.filter(x => x.Username != 'admin');
            this.setEvents();
        }

        protected setFindUserInputOnChangeAction() {
            let self = this;
            this.elements.findUserInput.onkeyup = () => {
                let inputVal = self.elements.findUserInput.value;
                let userListCont = self.elements.userListContainer;

                if (!inputVal) {
                    userListCont.style.display = 'none';
                    return;
                }
                userListCont.style.display = 'block';
                interface userDto { displayName: string; username: string };

                let filteredUsers: userDto[] = self.users
                    .filter
                    (x => x.DisplayName.toLowerCase().isSubstr(inputVal.toLowerCase()))
                    .map(x => ({ displayName: x.DisplayName, username: x.Username } as userDto));

                userListCont.style.display = filteredUsers.length > 0 ? 'block' : 'none';

                while (userListCont.childNodes.length > 0)
                    userListCont.removeChild(userListCont.childNodes.item(0));

                filteredUsers.forEach(user => {
                    let pElement = document.createElement('p');
                    pElement.classList.add('user-list-item');
                    pElement.setAttribute('username', user.username);
                    pElement.innerHTML = user.displayName;
                    userListCont.appendChild(pElement);
                });
            };
        }

        protected setFindUserContainerChildrenOnBlurAction() {
            document.addEventListener('click', (e: PointerEvent) => {
                let target = (e.target as HTMLElement);
                if (target.parentElement.id != 'find-user-container') {
                    this.elements.userListContainer.style.display = 'none';
                    this.elements.findUserInput.value = '';
                }
            });
        }

        protected setUserItemOnClickAction() {
            this.elements.userListContainer.addEventListener('click', (e: PointerEvent) => {
                let target = (e.target as HTMLElement);
                if (target.classList.contains('user-list-item'))
                    console.log(target.getAttribute('username'));

                this.elements.userListContainer.style.display = 'none';
                this.elements.findUserInput.value = '';
                // TODO: Fetch messages
            });
        }

        protected setEvents() {
            this.setFindUserInputOnChangeAction();
            this.setUserItemOnClickAction();
            this.setFindUserContainerChildrenOnBlurAction();
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
        public grid = document.querySelector('.grid-container') as HTMLElement;
        public chatContainer = document.querySelector('#chat-container') as HTMLElement;
        public userListContainer = document.querySelector('#user-list-container') as HTMLElement;
        public findUserContainer = document.querySelector('#find-user-container') as HTMLElement;
        public findUserInput = document.querySelector('#find-user-input') as HTMLInputElement;
    }
}