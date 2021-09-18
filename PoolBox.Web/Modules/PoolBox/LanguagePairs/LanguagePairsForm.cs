using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.IO;

namespace PoolBox.PoolBox.Forms
{
    [FormScript("PoolBox.LanguagePairs")]
    [BasedOnRow(typeof(Entities.LanguagePairsRow), CheckNames = true)]
    public class LanguagePairsForm
    {
        public String TranslateFrom { get; set; }
        public String TranslateTo { get; set; }
    }
}