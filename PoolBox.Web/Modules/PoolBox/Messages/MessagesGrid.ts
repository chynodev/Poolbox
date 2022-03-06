
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
        protected allUserMessages: MessagesRow[];
        protected selectedUserMessages: MessagesRow[];
        protected myMsgTemplateElement: HTMLElement;
        protected theirMsgTemplateElement: HTMLElement;
        protected inboxListItemTemplateElement: HTMLElement;
        protected selectedUser: Administration.UserRow;
        protected loggedUser: Administration.UserRow;
        protected selectedInboxUserElement: HTMLElement;
        protected readonly hubMethods = {
            joinGroup: 'AddUserToGroupAsync',
            sendMessage: 'SendMessage',
            receiveMessage: 'ReceiveMessage'
        };

        constructor(container: JQuery) {
            super(container);

            this.slickGrid.destroy();
            this.elements = new PageElements();
            this.elements.grid.appendChild(this.elements.chatContainer);
            this.setTitle("Inbox");
            this.getLoggedUser();
            this.users = Administration.UserRow.getLookup().items;//.filter(x => x.Username != 'admin');
            this.setEvents();
            this.fetchUserMessages();
            this.initTemplateElements();
            this.populateInboxList();
        }

        protected getLoggedUser() {
            Administration.UserService.GetLoggedUser(
                {},
                user => this.loggedUser = user.Entity,
                { async: false }
            );
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

                let users = self.users.filter(x => x.Username != self.loggedUser.Username);
                let filteredUsers: userDto[] = users
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
                if (target?.parentElement?.id != 'find-user-container') {
                    this.elements.userListContainer.style.display = 'none';
                    this.elements.findUserInput.value = '';
                }
            });
        }

        protected setUserItemOnClickAction() {
            const clickEvent = (e: PointerEvent) => {
                let target = (e.target as HTMLElement);
                if (target.classList.contains('user-list-item')) {
                    let selectedUser = Q.tryFirst(this.users, x => x.Username == target.getAttribute('username'));
                    let itemElement;

                    if (selectedUser && selectedUser.Username != this.selectedUser.Username) {
                        if (!this.getInboxElementByUsername(selectedUser.Username)) {
                            itemElement = this.createInboxItem({
                                msgUser: selectedUser,
                                lastMessage: null
                            });
                            this.selectInboxUser(itemElement);
                        } else {
                            itemElement = this.getInboxElementByUsername(selectedUser.Username);
                            this.selectInboxUser(itemElement);
                        }
                        this.elements.inboxListContainer.appendChild(itemElement);
                    }
                }
                this.elements.userListContainer.style.display = 'none';
                this.elements.findUserInput.value = '';
            };

            this.elements.userListContainer.addEventListener('click', clickEvent.bind(this));
        }

        protected getInboxElementByUsername(username: string): HTMLElement {
            let result;

            this.elements.inboxListContainer.childNodes.forEach((child: HTMLElement) => {
                if (child.getAttribute && child.getAttribute('username') == username)
                    result = child;
            });
            return result;
        } 

        protected fetchUserMessages() {
            MessagesService.List(
                { IncludeColumns: ['SenderName', 'RecipientName', 'SenderDisplayName', 'RecipientDisplayName'] },
                resp => this.allUserMessages = resp.Entities,
                { async: false }
            );
        }

        protected initTemplateElements() {
            this.myMsgTemplateElement = document.querySelector('.my-msg-box-container').cloneNode(true) as HTMLElement;
            this.theirMsgTemplateElement = document.querySelector('.their-msg-box-container').cloneNode(true) as HTMLElement;
            this.inboxListItemTemplateElement = document.querySelector('.inbox-list-item').cloneNode(true) as HTMLElement;
            document.querySelector('.my-msg-box-container').remove();
            document.querySelector('.their-msg-box-container').remove();
            document.querySelector('.inbox-list-item').remove();
        }

        protected setEvents() {
            this.setFindUserInputOnChangeAction();
            this.setUserItemOnClickAction();
            this.setFindUserContainerChildrenOnBlurAction();
            this.setSendBtnOnClickAction();
            this.setOnReceiveAction();
            this.setSendVocabularyBtnOnClickAction();
        }

        protected populateInboxList() {
            let inboxUsers: string[] = [];
            this.allUserMessages.forEach(x => {
                if (inboxUsers.indexOf(x.SenderName) < 0 && x.SenderName != this.loggedUser.Username)
                    inboxUsers.push(x.SenderName);

                if (inboxUsers.indexOf(x.RecipientName) < 0 && x.RecipientName != this.loggedUser.Username)
                    inboxUsers.push(x.RecipientName);
            });

            let inboxListitems: InboxListItem[] = [];
            inboxUsers.forEach(username => {
                inboxListitems.push({
                    msgUser: Q.tryFirst(this.users, user => user.Username == username),
                    lastMessage: this.allUserMessages
                        .filter(x => [x.SenderName, x.RecipientName].indexOf(username) > -1)
                        .reduce((x, y) => new Date(x.SentDate) > new Date(y.SentDate) ? x : y)
                }); 
            });
            inboxListitems = inboxListitems.sort((x, y) => new Date(x.lastMessage.SentDate) > new Date(x.lastMessage.SentDate) ? -1 : 1);
            inboxListitems.forEach((item, idx) => {
                let itemElement = this.createInboxItem(item);

                if (idx == 0) 
                    this.selectInboxUser(itemElement);

                this.elements.inboxListContainer.appendChild(itemElement);
            });
            this.elements.chatContainer.style.visibility = 'visible';
        }

        protected createInboxItem(item: InboxListItem): HTMLElement {
            let itemElement = this.inboxListItemTemplateElement.cloneNode(true) as HTMLElement;
            itemElement.querySelector('.username').innerHTML = item.msgUser.DisplayName;

            if (item.lastMessage) {
                let month = new Date(item.lastMessage.SentDate).getMonthString();
                let day = new Date(item.lastMessage.SentDate).getDay();
                itemElement.querySelector('.last-msg-date').innerHTML = month + ' ' + day;
                itemElement.querySelector('.inbox-message').innerHTML = item.lastMessage.Content;
            }
            itemElement.setAttribute('username', item.msgUser.Username);
            itemElement.addEventListener('click', (e: PointerEvent) => {
                this.selectInboxUser(itemElement);
            });

            return itemElement;
        }

        protected selectInboxUser(itemElement: HTMLElement) {
            this.selectedInboxUserElement?.classList.remove('selected-message');
            this.selectedInboxUserElement = itemElement;
            itemElement.classList.add('selected-message');

            let oldUsername = this.selectedUser?.Username;
            let selectedUsername = itemElement.getAttribute('username');
            this.selectedUser = Q.tryFirst(this.users, x => x.Username == selectedUsername);
            
            while (this.elements.messagesListContainer.lastElementChild) {
                this.elements.messagesListContainer.removeChild(this.elements.messagesListContainer.lastElementChild);
            }
            this.displayMessages();

            connection
                .invoke(this.hubMethods.joinGroup, oldUsername, this.selectedUser.Username)
                .catch(err => console.error(err.toString()));
        }

        protected updateInboxItemMessageContent(msg: MessagesRow) {
            let inboxItem;

            let items = Array.prototype.slice.call(this.elements.inboxListContainer.children);

            for (let item of items) {
                if (inboxItem) continue;

                let element = item as HTMLElement;
                if (element.getAttribute('username') == msg.RecipientName || element.getAttribute('username') == msg.SenderName)
                    inboxItem = element;
            }
            if (this.elements.inboxListContainer.firstChild != inboxItem) 
                this.elements.inboxListContainer.insertBefore(inboxItem, this.elements.inboxListContainer.firstChild);

            let month = new Date(msg.SentDate).getMonthString();
            let day = new Date(msg.SentDate).getDay();
            inboxItem.querySelector('.last-msg-date').innerHTML = month + ' ' + day;
            inboxItem.querySelector('.inbox-message').innerHTML = msg.Content;
        }

        protected sendMessage() {
            let messageContent = this.elements.messageInput.value;
            if (!messageContent)
                return;

            connection
                .invoke(this.hubMethods.sendMessage, this.selectedUser.Username, messageContent)
                .catch(err => console.error(err.toString()));

            this.elements.messageInput.value = '';
        }

        protected setOnReceiveAction() {
            connection.on(this.hubMethods.receiveMessage, (response: string) => {
                var respObject = JSON.parse(response);
                var receiverName = respObject.receiverName;
                var message = respObject.message as MessagesRow;

                let isSender = receiverName != this.loggedUser.Username;
                this.appendMessage(message, isSender);
                this.updateInboxItemMessageContent(message);
            });
        }

        protected setSendBtnOnClickAction() {
            this.elements.sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        protected displayMessages() {
            const getUserPairRelationshipType: (MessagesRow) => 1 | 2 | 3 = (msg: MessagesRow) => {
                if (msg.RecipientName == this.selectedUser.Username && msg.SenderName == this.loggedUser.Username)
                    return 1;
                if (msg.SenderName == this.selectedUser.Username && msg.RecipientName == this.loggedUser.Username)
                    return 2;

                return 3;
            };
            this.selectedUserMessages = this.allUserMessages
                .filter(x => getUserPairRelationshipType(x) != 3)
                .sort((a, b) => new Date(a.SentDate) > new Date(b.SentDate) ? 1 : -1);

            this.selectedUserMessages.forEach(msg => {
                if (getUserPairRelationshipType(msg) == 1)
                    this.appendMessage(msg, true);

                else if (getUserPairRelationshipType(msg) == 2)
                    this.appendMessage(msg);
            }, this);

            this.elements.messagesListContainer.scrollTop = this.elements.messagesListContainer.scrollHeight;
        }

        protected appendMessage(message: MessagesRow, isLoggedUserSender: boolean = false) {
            if (isLoggedUserSender) {
                let messageElement = this.createMessageElement(message, this.myMsgTemplateElement)
                this.elements.messagesListContainer.appendChild(messageElement)
            } else {
                let messageElement = this.createMessageElement(message, this.theirMsgTemplateElement)
                this.elements.messagesListContainer.appendChild(messageElement)
            }
            this.elements.messagesListContainer.scrollTop = this.elements.messagesListContainer.scrollHeight;
        }

        protected createMessageElement(message: MessagesRow, templateNode: HTMLElement): HTMLElement {
            let messageContentClass = '.message-content';
            let messageTimeClass = '.message-time';

            let messageElement = templateNode.cloneNode(true) as HTMLElement;
            messageElement.querySelector(messageContentClass).innerHTML = message.Content;

            let hours = new Date(message.SentDate).getHours();
            let minutes = new Date(message.SentDate).getMinutes();
            let time = `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes) : minutes }`;

            let day = new Date(message.SentDate).getDay();
            let month = new Date(message.SentDate).getMonthString();
            let date = day + ' ' + month;

            messageElement.querySelector(messageTimeClass).innerHTML = time + ' | ' + date;

            return messageElement;
        }

        protected setSendVocabularyBtnOnClickAction() {
            const clickEvent = () => {
                var dlg = new TranslationsSelectionDialog();
                dlg.init();
                dlg.dialogOpen();
            };
            this.elements.sendVocabularyBtn.addEventListener('click', clickEvent);
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

    interface InboxListItem {
        msgUser: Administration.UserRow;
        lastMessage: MessagesRow;
    }

    class PageElements {
        public grid = document.querySelector('.grid-container') as HTMLElement;
        public chatContainer = document.querySelector('#chat-container') as HTMLElement;
        public userListContainer = document.querySelector('#user-list-container') as HTMLElement;
        public findUserContainer = document.querySelector('#find-user-container') as HTMLElement;
        public findUserInput = document.querySelector('#find-user-input') as HTMLInputElement;
        public messagesListContainer = document.querySelector('#messages-list') as HTMLElement;
        public inboxListContainer = document.querySelector('#inbox-list') as HTMLInputElement;
        public messageInput = document.querySelector('#message-input') as HTMLInputElement;
        public sendBtn = document.querySelector('#msg-send-btn') as HTMLInputElement;
        public sendVocabularyBtn = document.querySelector('#send-vocabulary-btn') as HTMLInputElement;
    }
}