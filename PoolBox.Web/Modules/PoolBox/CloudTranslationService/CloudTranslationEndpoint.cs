using System;
using System.Linq;
using Serenity;
using Serenity.Data;
using Serenity.Services;
using Microsoft.AspNetCore.Mvc;
using MyRow = PoolBox.PoolBox.Entities.TranslationsRow;
using PoolBox.Requests;
using PoolBox.Responses;
using Microsoft.Extensions.Configuration;
using PoolBox.PoolBox.Repositories;
using RestSharp;
using Newtonsoft.Json;
using PoolBox.CloudTranslationService;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("/CloudServices/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class CloudTranslationController : ServiceEndpoint
    {
        private readonly string BaseUrl = $"https://translation.googleapis.com/language/translate/v2";

        [HttpPost]
        public CloudTranslateResponse Translate(IUnitOfWork uow, CloudTranslateRequest request, [FromServices]IConfiguration configuration)
        {
            Uri baseUrl = new Uri(BaseUrl);
            var client = new RestClient(baseUrl);
            var req = new RestRequest(Method.POST);

            var languagePair = LanguagePairsRepository.GetCurrent(uow.Connection, Context);
            
            req.AddQueryParameter("q", request.Text)
                .AddQueryParameter("source", languagePair.TranslateFrom)
                .AddQueryParameter("target", languagePair.TranslateTo)
                .AddQueryParameter("key", configuration["ApiKeys:CloudTranslate"]);

            var response = client.Execute(req);
            
            dynamic responseObj = JsonConvert.DeserializeObject(response.Content);
            string translatedText = responseObj.data?.translations[0].translatedText.Value;
            MyRow row = null;
            
            if (!translatedText.IsEmptyOrNull())
            {
                var rowId = new TranslationsRepository(Context).Create(
                    uow,
                    new SaveRequest<MyRow>
                    {
                        Entity = new MyRow
                        {
                            Original = request.Text,
                            Translated = translatedText
                        }
                    }
                ).EntityId;

                row = uow.Connection.TryById<MyRow>(rowId);
            }
            return new CloudTranslateResponse { Row = row } ;
        }

        [HttpPost]
        public TextToSpeechResponse GetTextToSpeechRecording(IUnitOfWork uow, CloudTranslateRequest request, [FromServices] IConfiguration configuration)
        {
            Uri baseUrl = new Uri("https://texttospeech.googleapis.com/v1beta1/text:synthesize");
            var client = new RestClient(baseUrl);
            var req = new RestRequest(Method.POST);

            var languagePair = LanguagePairsRepository.GetCurrent(uow.Connection, Context);

            req.AddQueryParameter("key", configuration["ApiKeys:TextToSpeech"]);

            var audioConfig = new AudioConfig
            {
                audioEncoding = "LINEAR16",
                pitch = 0,
                speakingRate = 1
            };

            var input = new Input 
            {
                text = request.Text
            };

            var voice = new Voice
            {
                languageCode = languagePair.TranslateFrom,
                name = LanguageCountryCodes
                    .getCodes
                    .First(x => x.Contains($"{languagePair.TranslateFrom.ToLower()}-")) + "-Wavenet-A"
            };

            req.AddJsonBody(new { 
                    audioConfig = audioConfig,
                    input = input,
                    voice = voice
                }
            );

            var response = client.Execute(req);

            dynamic responseObj = JsonConvert.DeserializeObject(response.Content);
            string audioRecordingCode = responseObj?.audioContent;

            return new TextToSpeechResponse { audioCode = audioRecordingCode };
        }

    }
}
