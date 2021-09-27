using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;

namespace PoolBox.PoolBox.Columns
{
    [ColumnsScript("PoolBox.Translations")]
    [BasedOnRow(typeof(Entities.TranslationsRow), CheckNames = true)]
    public class TranslationsColumns
    {
        [EditLink]
        public String Original { get; set; }
        [EditLink]
        public String Translated { get; set; }
        [EditLink]
        public String WordType { get; set; }
        [EditLink]
        public String NounGender { get; set; }
        [Hidden]
        public DateTime? CreateDate { get; set; }
        [Hidden]
        public String Error { get; set; }

    }
}