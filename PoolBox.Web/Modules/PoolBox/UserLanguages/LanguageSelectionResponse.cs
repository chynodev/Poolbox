using PoolBox.PoolBox.Entities;
using System.Collections.Generic;

namespace PoolBox.Responses
{
    public class LanguageSelectionResponse
    {
        public List<UserLanguagesRow> Languages { get; set; }
        public int OriginalLanguageId { get; set; }
        public int TargetLanguageId { get; set; }
    }
}
