using Serenity.ComponentModel;
using System;

namespace PoolBox.PoolBox.Forms
{
    [FormScript("PoolBox.FileImport")]
    public class FileImportForm
    {
        [FileUploadEditor, Required]
        public String FileName { get; set; }
    }
}
