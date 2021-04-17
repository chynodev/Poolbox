using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.Requests
{
    public class TranslationRequest : ServiceRequest
    {
        public string Word { get; set; }
    }
}
