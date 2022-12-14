using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MyRepository = PoolBox.PoolBox.Repositories.MessagesRepository;
using MyRow = PoolBox.PoolBox.Entities.MessagesRow;
using System;
using System.Linq;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/Messages/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class MessagesController : ServiceEndpoint
    {
        [HttpPost, AuthorizeCreate(typeof(MyRow))]
        public SaveResponse Create(IUnitOfWork uow, SaveRequest<MyRow> request)
        {
            return new MyRepository(Context).Create(uow, request);
        }

        [HttpPost, AuthorizeUpdate(typeof(MyRow))]
        public SaveResponse Update(IUnitOfWork uow, SaveRequest<MyRow> request)
        {
            return new MyRepository(Context).Update(uow, request);
        }
 
        [HttpPost, AuthorizeDelete(typeof(MyRow))]
        public DeleteResponse Delete(IUnitOfWork uow, DeleteRequest request)
        {
            return new MyRepository(Context).Delete(uow, request);
        }

        [HttpPost]
        public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request)
        {
            return new MyRepository(Context).Retrieve(connection, request);
        }

        [HttpPost]
        public ListResponse<MyRow> List(IDbConnection connection, ListRequest request)
        {
            var userId = Context.User.GetIdentifier();
            var resp = new MyRepository(Context).List(connection, request);
            Func<string, int?> tryParse = (string val) => val == null ? null : (int?)int.Parse(val);

            resp.Entities = resp
                .Entities
                .Where(x => (x.RecipientId == int.Parse(userId) || x.SenderId == tryParse(userId)) && x.RecipientId != null)
                .ToList();

            return resp;
        }
    }
}
