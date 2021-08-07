using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.IO;

namespace PoolBox.PoolBox.Forms
{
    [FormScript("PoolBox.Translations")]
    [BasedOnRow(typeof(Entities.TranslationsRow), CheckNames = true)]
    public class TranslationsForm
    {
        public String Original { get; set; }
        public String Translated { get; set; }
        public String WordType { get; set; }
        [Hidden]
        public Int64 PairId { get; set; }
    }
}