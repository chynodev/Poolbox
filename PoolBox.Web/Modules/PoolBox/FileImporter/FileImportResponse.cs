using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.Responses
{
    public class FileImportResponse : ServiceRequest
    {
        public String Text { get; set; }
    }
}
