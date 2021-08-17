using Serenity.ComponentModel;
using System;

namespace PoolBox.PoolBox.Forms
{
    [FormScript("PoolBox.TranslationsFileImport")]
    public class TranslationsFileImportForm
    {
        [FileUploadEditor, Required]
        public String FileName { get; set; }
    }
}
