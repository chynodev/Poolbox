using Serenity.ComponentModel;
using System;

namespace PoolBox.PoolBox.Columns
{
    [ColumnsScript("PoolBox.TranslationsSelection")]
    [BasedOnRow(typeof(Entities.TranslationsRow), CheckNames = true)]
    public class TranslationsSelectionColumns
    {
        [Hidden]
        public Int64? TrId { get; set; }
        [EditLink]
        public String Original { get; set; }
        [EditLink]
        public String Translated { get; set; }

    }
}