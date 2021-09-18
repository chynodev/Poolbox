using Serenity.Services;

namespace PoolBox.Requests
{
    public class CloudTranslateRequest : ServiceRequest
    {
        public string Text { get; set; }
    }
}
