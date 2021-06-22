using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.Requests
{
    public class FileImportRequest : ServiceRequest
    {
        public String FileName { get; set; }
    }
}
