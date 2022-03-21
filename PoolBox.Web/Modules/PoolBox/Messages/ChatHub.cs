using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using PoolBox.PoolBox.Entities;
using PoolBox.PoolBox.Repositories;
using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            PresenceTracker.AddConnection(Context.User.Identity.Name, Context.ConnectionId);

            return base.OnConnectedAsync();
        }

        public async Task AddUserToGroupAsync(string oldReceiver, string newReceiver)
        {
            if (!String.IsNullOrEmpty(oldReceiver))
                await Groups.RemoveFromGroupAsync(
                    Context.ConnectionId,
                    GetGroupName(oldReceiver)
                );
            
            var newGroupName = GetGroupName(newReceiver);

            await Groups.AddToGroupAsync(Context.ConnectionId, newGroupName);
        }

        protected string GetGroupName(string secondUsername)
        {
            var names = new string[] { Context.User.Identity.Name, secondUsername }
            .OrderByDescending(x => x)
            .ToArray();

            return names?[0] + "-" + names?[1];
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            PresenceTracker.RemoveConnection(Context.User.Identity.Name);

            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string receiverName, string messageContent, bool isVocabulary = false)
        {
            var groupName = GetGroupName(receiverName);
            var context = Context.GetHttpContext()?.RequestServices?.GetRequiredService<IRequestContext>();

            var messageRow = new MessagesRepository(context).CreateWithoutConnection(
                Context.User.Identity.Name,
                receiverName,
                messageContent,
                isVocabulary
            );
            messageRow.SenderDisplayName = null;
            messageRow.RecipientDisplayName = null;
            
            if (messageRow != null)
            {
                var response = Newtonsoft.Json.JsonConvert.SerializeObject(new { receiverName = receiverName, message = messageRow });
                await Clients.Group(groupName).SendAsync("ReceiveMessage", response);
            }
        }

        public async Task UploadVocabulary(string messageContent)
        {
            var context = Context.GetHttpContext()?.RequestServices?.GetRequiredService<IRequestContext>();

            var messageRow = new MessagesRepository(context).CreateWithoutConnection(
                Context.User.Identity.Name,
                null,
                messageContent,
                true
            );

            if (messageRow != null)
                await Clients.All.SendAsync("UpdateLibraryFeed");
        }
    }
}
