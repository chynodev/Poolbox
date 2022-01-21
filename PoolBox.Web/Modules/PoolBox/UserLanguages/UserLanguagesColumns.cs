using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.IO;

namespace PoolBox.PoolBox.Columns
{
    [ColumnsScript("PoolBox.UserLanguages")]
    [BasedOnRow(typeof(Entities.UserLanguagesRow), CheckNames = true)]
    public class UserLanguagesColumns
    {
        [EditLink, DisplayName("Db.Shared.RecordId"), AlignRight]
        public Int32 Id { get; set; }
        [EditLink]
        public String Code { get; set; }
        public String Name { get; set; }
    }
}