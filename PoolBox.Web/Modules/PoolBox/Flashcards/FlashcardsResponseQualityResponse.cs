using PoolBox.PoolBox.Entities;
using Serenity.Services;

namespace PoolBox.Responses
{
    public class FlashcardsResponseQualityResponse : ServiceResponse
    {
        public TranslationsRow Row { get; set; }
    }
}
