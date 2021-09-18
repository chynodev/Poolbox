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
using PoolBox.Web.Modules.Common.Helpers;

namespace PoolBox.PoolBox.Endpoints
{
    public partial class TranslationsController : ServiceEndpoint
    {
        [HttpPost, AuthorizeCreate(typeof(MyRow))]
        public RetrieveResponse<MyRow> Import(IUnitOfWork uow, SaveRequest<MyRow> request)
        {
            var response = new RetrieveResponse<MyRow> { Entity = request.Entity} ;

            try
            {
                request.Entity.TrId = null;
                new MyRepository(Context).Create(uow, request);
            }
            catch(Exception ex)
            {
                response.Entity.Error = ex.Message;
            }
            
            return response;
        }

        protected ListResponse<MyRow> CSVClipboardFormatAndCheck(ClipboardFormatRequest request)
        {
            var rdr = new ChoETL.ChoCSVReader(
                new StringReader(request.ClipboardText)
                , new ChoETL.ChoCSVRecordConfiguration()
                {
                    Delimiter = "\t",
                    AutoDiscoverFieldTypes = true,
                    ThrowAndStopOnMissingField = false
                }
            );
            return FormatAndCheck(rdr);
        }

        protected ListResponse<MyRow> FormatAndCheck(IEnumerable<dynamic> rdr)
        {
            var rows = new List<MyRow>();
            
            foreach (dynamic row in rdr)
            {
                var item = row.GetType() == typeof(ChoETL.ChoDynamicObject) ? row : ChoETL.ChoDynamicObject.FromDictionary(row);

                MyRow newRow = CreateImportableRow(item);
                rows.Add(newRow);
            }
            return new ListResponse<MyRow> { Entities = rows};
        }

        protected ListResponse<MyRow> CSVFileFormatAndCheck(FileFormatRequest request)
        {
            var fullFileName = @$"{Directory.GetCurrentDirectory()}\App_data\upload\{request.FileName}";

            var fs = new FileStream(fullFileName, FileMode.Open);
            IEnumerable<dynamic> rdr = new ChoETL.ChoCSVReader();
            switch (new FileInfo(fullFileName).Extension)
            {
                case ".xlsx":
                    var worksheet = new OfficeOpenXml.ExcelPackage(fs).Workbook.Worksheets[0];
                    rdr = worksheet.GetRows();
                    break;
                case ".csv":
                    var delimiter = new[] { ";", ",", "\t", ".|" }
                    .OrderByDescending(delimiter =>
                    {
                        return new ChoETL.ChoCSVReader(
                            fs
                            , new ChoETL.ChoCSVRecordConfiguration()
                            {
                                Delimiter = delimiter,
                                AutoDiscoverFieldTypes = true,
                                ThrowAndStopOnMissingField = false
                            }
                        ).AsDataReader().FieldCount;
                    }).First();

                    rdr = new ChoETL.ChoCSVReader(
                        fs
                        , new ChoETL.ChoCSVRecordConfiguration()
                        {
                            Delimiter = delimiter,
                            AutoDiscoverFieldTypes = true,
                            ThrowAndStopOnMissingField = false
                        }
                    );
                    break;
            }
            var res = FormatAndCheck(rdr);
            fs.Close();
            
            var directoryPath = Path.GetDirectoryName(fullFileName);
            var directoryName = Path.GetFileName(directoryPath);
            if (directoryName == "temporary")
            {
                var fileDirectory = new DirectoryInfo(directoryPath);
                foreach (FileInfo file in fileDirectory.GetFiles())
                {
                    file.Delete();
                }
            }

            return res;
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
