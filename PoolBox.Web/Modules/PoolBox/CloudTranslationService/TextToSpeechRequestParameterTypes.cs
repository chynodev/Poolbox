using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.CloudTranslationService
{
    public class AudioConfig
    {
        public string audioEncoding { get; set; }
        public int pitch { get; set; }
        public int speakingRate { get; set; }
    }

    public class Input
    {
        public string text { get; set; }
    }

    public class Voice
    {
        public string languageCode { get; set; }
        public string name { get; set; }
    }
}
