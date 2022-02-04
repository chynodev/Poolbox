using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.IO;

namespace PoolBox.PoolBox.Columns
{
    [ColumnsScript("PoolBox.Messages")]
    [BasedOnRow(typeof(Entities.MessagesRow), CheckNames = true)]
    public class MessagesColumns
    {
        [EditLink, DisplayName("Db.Shared.RecordId"), AlignRight]
        public Int32 Id { get; set; }
        public Int32 SenderId { get; set; }
        public Int32 RecipientId { get; set; }
        [EditLink]
        public String Content { get; set; }
        public Int16 IsRead { get; set; }
        public DateTime SentDate { get; set; }
    }
}