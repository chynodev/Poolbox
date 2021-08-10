using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;

namespace PoolBox.PoolBox.Forms
{
    [FormScript("PoolBox.Translations")]
    [BasedOnRow(typeof(Entities.TranslationsRow), CheckNames = true)]
    public class TranslationsPanelForm
    {
        [CssClass("form-field-container")]
        public String Original { get; set; }
        [CssClass("form-field-container")]
        public String Translated { get; set; }
        [CssClass("form-field-container")]
        public String WordType { get; set; }
        [Hidden]
        public Int64 PairId { get; set; }
    }
}