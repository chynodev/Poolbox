using PoolBox.PoolBox.Entities;
using Serenity.Services;

namespace PoolBox.Responses
{
    public class CloudTranslateResponse : ServiceResponse
    {
        public TranslationsRow Row { get; set; }
    }
}
