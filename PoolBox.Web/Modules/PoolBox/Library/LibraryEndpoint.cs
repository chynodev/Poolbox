using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MyRepository = PoolBox.PoolBox.Repositories.MessagesRepository;
using MyRow = PoolBox.PoolBox.Entities.MessagesRow;
using System.Linq;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/Library/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class LibraryController : ServiceEndpoint
    {
        [HttpPost, AuthorizeCreate(typeof(MyRow))]
        public SaveResponse Create(IUnitOfWork uow, SaveRequest<MyRow> request)
        {
            return new MyRepository(Context).Create(uow, request);
        }

        [HttpPost]
        public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request)
        {
            return new MyRepository(Context).Retrieve(connection, request);
        }

        [HttpPost]
        public ListResponse<MyRow> List(IDbConnection connection, ListRequest request)
        {
            var resp = new MyRepository(Context).List(connection, request);

            resp.Entities = resp
                .Entities
                .Where(x => x.RecipientId == null && x.IsVocabulary == true)
                .Select(x => new MyRow {
                    Id = x.Id,
                    SenderDisplayName = x.SenderDisplayName,
                    Content = x.Content,
                    VocabularyName = x.Content?.Split("-")?[0],
                    SentDate = x.SentDate
                })
                .ToList();

            return resp;
        }
    }
}
