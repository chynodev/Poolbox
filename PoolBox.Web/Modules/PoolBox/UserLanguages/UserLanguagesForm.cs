using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.IO;

namespace PoolBox.PoolBox.Forms
{
    [FormScript("PoolBox.UserLanguages")]
    [BasedOnRow(typeof(Entities.UserLanguagesRow), CheckNames = true)]
    public class UserLanguagesForm
    {
        public String Code { get; set; }
        public String Name { get; set; }
    }
}