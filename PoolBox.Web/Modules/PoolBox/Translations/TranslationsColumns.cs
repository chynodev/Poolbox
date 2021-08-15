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
        public String Translated { get; set; }
        public String WordType { get; set; }
        public String NounGender { get; set; }

    }
}