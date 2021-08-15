using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MyRepository = PoolBox.PoolBox.Repositories.TranslationsRepository;
using MyRow = PoolBox.PoolBox.Entities.TranslationsRow;
using System;
using PoolBox.Requests;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/Translations/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class TranslationsController : ServiceEndpoint
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

        [HttpPost]
        public ListResponse<MyRow> FormatClipboardText(ClipboardFormatRequest request)
        {
            var response = new ListResponse<MyRow>();
            response.Entities = FormatAndCheck(request.ClipboardText);

            return response;
        }

        protected List<MyRow> FormatAndCheck(string clipboardText)
        {
            var rdr = new ChoETL.ChoCSVReader(
                new StringReader(clipboardText)
                , new ChoETL.ChoCSVRecordConfiguration()
                {
                    Delimiter = "\t",
                    AutoDiscoverFieldTypes = true,
                    ThrowAndStopOnMissingField = false
                }
            );
            var rows = new List<MyRow>();
            
            try
            {
                foreach (ChoETL.ChoDynamicObject item in rdr)
                {
                    MyRow newRow = CreateImportableRow(item);
                    rows.Add(newRow);
                }
            }
            catch (Exception exc){ }
            
            return rows;
        }

        protected MyRow CreateImportableRow(ChoETL.ChoDynamicObject item)
        {  
            MyRow newRow = new MyRow()
            {
                Original = item.ValuesArray.ElementAtOrDefault(0)?.ToString(),
                Translated = item.ValuesArray.ElementAtOrDefault(1)?.ToString(),
                WordType = item.ValuesArray.ElementAtOrDefault(2)?.ToString(),
                NounGender = item.ValuesArray.ElementAtOrDefault(3)?.ToString(),
            };
            return newRow;
        }
    }
}
