using Serenity.Services;

namespace PoolBox.Responses
{
    public class TextToSpeechResponse : ServiceResponse
    {
        public string audioCode { get; set; }
    }
}
