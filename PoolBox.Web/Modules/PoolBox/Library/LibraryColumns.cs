using Serenity.ComponentModel;
using System;
using System.ComponentModel;

namespace PoolBox.PoolBox.Columns
{
    [ColumnsScript("PoolBox.Library")]
    [BasedOnRow(typeof(Entities.MessagesRow), CheckNames = true)]
    public class LibraryColumns
    {
        [Hidden]
        public Int32 Id { get; set; }
        [EditLink]
        public String VocabularyName { get; set; }
        [DisplayName("Author")]
        public String SenderDisplayName { get; set; }
        [Hidden]
        public DateTime SentDate { get; set; }
    }
}