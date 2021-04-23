using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.IO;

namespace PoolBox.PoolBox.Columns
{
    [ColumnsScript("PoolBox.Translations")]
    [BasedOnRow(typeof(Entities.TranslationsRow), CheckNames = true)]
    public class TranslationsColumns
    {
        [EditLink, DisplayName("Db.Shared.RecordId"), AlignRight]
        public Int64 TrId { get; set; }
        [EditLink]
        public String Original { get; set; }
        public String Translated { get; set; }
    }
}