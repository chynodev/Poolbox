using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MyRepository = PoolBox.PoolBox.Repositories.TranslationsRepository;
using MyRow = PoolBox.PoolBox.Entities.TranslationsRow;
using PoolBox.Requests;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/Translations/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public partial class TranslationsController : ServiceEndpoint
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
            return new MyRepository(Context).List(connection, request);
        }

        [HttpPost, AuthorizeCreate(typeof(MyRow))]
        public SaveResponse SaveReceivedVocabulary(IUnitOfWork uow, ListResponse<MyRow> request)
        {
            var repo = new MyRepository(Context);
            
            foreach (var row in request.Entities)
            {
                var newRow = new MyRow
                {
                    Original = row.Original,
                    Translated = row.Translated,
                    PairId = row.PairId
                };
                repo.Create(uow, new SaveRequest<MyRow> { Entity = newRow});
            }
            return new SaveResponse();
        }

        [HttpPost, AuthorizeCreate(typeof(MyRow))]
        public ListResponse<MyRow> CSVFileFormatAndCheck(IUnitOfWork uow, FileFormatRequest request)
        {
            return CSVFileFormatAndCheck(request);
        }

        [HttpPost, AuthorizeCreate(typeof(MyRow))]
        public ListResponse<MyRow> CSVClipboardFormatAndCheck(IUnitOfWork uow, ClipboardFormatRequest request)
        {
            return CSVClipboardFormatAndCheck(request);
        }

    }
}
