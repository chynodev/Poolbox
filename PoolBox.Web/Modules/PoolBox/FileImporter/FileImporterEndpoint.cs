using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using Microsoft.AspNetCore.Mvc;
using PoolBox.PoolBox.Entities;
using PoolBox.Requests;
using PoolBox.Responses;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/FileImporter/[action]")]
    [ConnectionKey(typeof(TranslationsRow)), AuthorizeCreate(typeof(TranslationsRow))]
    public class FileImporterController : ServiceEndpoint
    {
     
        [HttpPost]
        public FileImportResponse GetUploadedFileText(IUnitOfWork uow, FileImportRequest request)
        {
            var fullFileName = @$"{Directory.GetCurrentDirectory()}\App_data\upload\{request.FileName}";
            var text = String.Empty;

            using (PdfReader reader = new PdfReader(fullFileName))
            {
                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    text += PdfTextExtractor.GetTextFromPage(reader, i);
                }
            }
            var response = new FileImportResponse { Text = text };

            var directoryPath = System.IO.Path.GetDirectoryName(fullFileName);
            var directoryName = System.IO.Path.GetFileName(directoryPath);
            if (directoryName.Equals("temporary"))
            {
                var fileDirectory = new DirectoryInfo(directoryPath);
                foreach (FileInfo file in fileDirectory.GetFiles())
                {
                    file.Delete();
                }
            }

            return response;
        }
    }
}
