using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.Requests
{
    public class FileFormatRequest : ServiceRequest
    {
        public String FileName { get; set; }
        public String OriginalFileName { get; set; }
    }

    public class ClipboardFormatRequest : ServiceRequest
    {
        public String ClipboardText { get; set; }
    }
}
