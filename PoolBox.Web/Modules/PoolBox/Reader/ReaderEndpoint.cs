using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using PoolBox.Responses;
using PoolBox.Requests;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/Reader/[action]")]
    //[ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class ReaderController : ServiceEndpoint
    {

        [HttpPost]
        public TranslationResponse Translate(TranslationRequest req)
        {
            var client = new RestClient($"https://www.dictionaryapi.com/api/v3/references/spanish/json/{req.Word}?key=c5eeee9e-cf36-4114-b565-1416e8c1296b");
            var request = new RestRequest(Method.GET);
            IRestResponse response = client.Execute(request);

            var resp = new TranslationResponse { Data = response.Content};

            return resp;
        }
        //[HttpPost, AuthorizeCreate(typeof(MyRow))]
        //public SaveResponse Create(IUnitOfWork uow, SaveRequest<MyRow> request)
        //{
        //    return new MyRepository(Context).Create(uow, request);
        //}

        //[HttpPost, AuthorizeUpdate(typeof(MyRow))]
        //public SaveResponse Update(IUnitOfWork uow, SaveRequest<MyRow> request)
        //{
        //    return new MyRepository(Context).Update(uow, request);
        //}

        //[HttpPost, AuthorizeDelete(typeof(MyRow))]
        //public DeleteResponse Delete(IUnitOfWork uow, DeleteRequest request)
        //{
        //    return new MyRepository(Context).Delete(uow, request);
        //}

        //[HttpPost]
        //public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request)
        //{
        //    return new MyRepository(Context).Retrieve(connection, request);
        //}

        //[HttpPost]
        //public ListResponse<MyRow> List(IDbConnection connection, ListRequest request)
        //{
        //    return new MyRepository(Context).List(connection, request);
        //}
    }

}
