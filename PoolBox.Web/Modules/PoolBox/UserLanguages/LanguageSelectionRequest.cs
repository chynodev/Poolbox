using Serenity.Services;

namespace PoolBox.Requests
{
    public class LanguageSelectionRequest : ServiceRequest
    {
        public int OriginalLanguageId { get; set; }
        public int TargetLanguageId { get; set; }
    }
}
