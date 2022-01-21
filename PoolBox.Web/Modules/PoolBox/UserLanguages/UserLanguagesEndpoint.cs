using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MyRepository = PoolBox.PoolBox.Repositories.UserLanguagesRepository;
using MyRow = PoolBox.PoolBox.Entities.UserLanguagesRow;
using PoolBox.Requests;
using Microsoft.Extensions.Configuration;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/UserLanguages/[action]")]
    [ConnectionKey(typeof(MyRow))]//, ServiceAuthorize(typeof(MyRow))]
    public class UserLanguagesController : ServiceEndpoint
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

        [ServiceAuthorize(typeof(MyRow))]
        [HttpPost]
        public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request)
        {
            return new MyRepository(Context).Retrieve(connection, request);
        }

        [ServiceAuthorize(typeof(MyRow))]
        [HttpPost]
        public ListResponse<MyRow> List(IDbConnection connection, ListRequest request)
        {
            return new MyRepository(Context).List(connection, request);
        }

        [HttpPost]
        [IgnoreAntiforgeryToken]
        public SaveResponse SaveLanguageSelection(IUnitOfWork uow, LanguageSelectionRequest request)
        {
            return new MyRepository(Context).SaveLanguageSelection(uow, request);
        }
    }
}
