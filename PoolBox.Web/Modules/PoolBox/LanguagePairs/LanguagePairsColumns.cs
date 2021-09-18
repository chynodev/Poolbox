using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.IO;

namespace PoolBox.PoolBox.Columns
{
    [ColumnsScript("PoolBox.LanguagePairs")]
    [BasedOnRow(typeof(Entities.LanguagePairsRow), CheckNames = true)]
    public class LanguagePairsColumns
    {
        [EditLink, DisplayName("Db.Shared.RecordId"), AlignRight]
        public Int64 PairId { get; set; }
        [EditLink]
        public String TranslateFrom { get; set; }
        public String TranslateTo { get; set; }
    }
}