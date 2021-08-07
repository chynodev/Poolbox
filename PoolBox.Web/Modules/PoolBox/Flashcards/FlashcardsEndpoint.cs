using Serenity;
using Serenity.Data;
using Serenity.Services;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MyRepository = PoolBox.PoolBox.Repositories.TranslationsRepository;
using MyRow = PoolBox.PoolBox.Entities.TranslationsRow;
using System;
using PoolBox.Requests;
using PoolBox.Responses;

namespace PoolBox.PoolBox.Endpoints
{
    [Route("Services/PoolBox/Flashcards/[action]")]
    [ConnectionKey(typeof(MyRow)), ServiceAuthorize(typeof(MyRow))]
    public class FlashcardsController : ServiceEndpoint
    {
        [HttpPost, AuthorizeUpdate(typeof(MyRow))]
        // SM-2 algorithm
        public FlashcardsResponseQualityResponse ProcessResponseQuality(IUnitOfWork uow, FlashcardsResponseQualityRequest request)
        {
            var row = request.Translation;
            var quality = request.Quality;

            if (quality == ResponseQuality.Bad)
            {
                row.Repetition = 0;
                row.IsRepeated = true;
            }
            else
            {
                row.Repetition++;
                row.Interval = CalculateRepetitionInterval(row.Repetition, (int)row.Interval, (float)row.EasinessFactor);
                row.EasinessFactor = CalculateEasinessFactor(row.EasinessFactor, (int)quality);
                row.DueDate = row.DueDate.Value.AddDays((float)row.Interval);
            }
            var error = new MyRepository(Context).Update(uow, new SaveRequest<MyRow> { Entity = row, EntityId = row.TrId }).Error;

            return new FlashcardsResponseQualityResponse { Row = row, Error = error };
        }

        private float CalculateEasinessFactor(float? previousEFactor, int respQuality)
        {
            var easinessFactor = (float)(previousEFactor + (0.1 - (5 - respQuality) * (0.08 + (5 - respQuality) * 0.02)));

            return easinessFactor < 1.3 ? 1.3F : easinessFactor;
        }

        private int CalculateRepetitionInterval(int? repetition, int previousInterval, float easinessFactor)
        {
            if (repetition < 1)
                throw new ArgumentOutOfRangeException("Repetition cannot be lower than 1.");

            if (repetition == 1)
                return 1;
            if (repetition == 2)
                return 6;

            var interval = (int) Math.Round(previousInterval * easinessFactor, 2, MidpointRounding.AwayFromZero);
            
            return interval;
        }

    }
}
