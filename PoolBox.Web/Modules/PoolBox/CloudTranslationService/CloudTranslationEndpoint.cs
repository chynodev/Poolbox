using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MyRepository = PoolBox.PoolBox.Repositories.TranslationsRepository;
using MyRow = PoolBox.PoolBox.Entities.TranslationsRow;
using PoolBox.Requests;
using PoolBox.Responses;
using Microsoft.Extensions.Configuration;
using PoolBox.PoolBox.Repositories;
using RestSharp;
using System.Text.Json;
using Newtonsoft.Json;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/CloudTranslation/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class CloudTranslationController : ServiceEndpoint
    {
        private readonly string BaseUrl = $"https://translation.googleapis.com/language/translate/v2";

        [HttpPost]
        public CloudTranslateResponse Translate(IDbConnection connection, CloudTranslateRequest request, [FromServices]IConfiguration configuration)
        {
            Uri baseUrl = new Uri(BaseUrl);
            var client = new RestClient(baseUrl);
            var req = new RestRequest(Method.POST);

            var languagePair = LanguagePairsRepository.GetCurrent(connection, Context);
            
            req.AddQueryParameter("q", request.Text)
                .AddQueryParameter("source", languagePair.TranslateFrom)
                .AddQueryParameter("target", languagePair.TranslateTo)
                .AddQueryParameter("key", configuration["ApiKeys:CloudTranslate"]);

            var response = client.Execute(req);
            
            dynamic responseObj = JsonConvert.DeserializeObject(response.Content);
            
            string translatedText = responseObj.data?.translations[0].translatedText.Value;

            return new CloudTranslateResponse { TranslatedText = translatedText };
        }
    }
}
