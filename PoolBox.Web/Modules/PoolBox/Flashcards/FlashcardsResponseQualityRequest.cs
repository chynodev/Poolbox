using PoolBox.PoolBox.Entities;
using Serenity.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.Requests
{
    public enum ResponseQuality
    {
        Bad,
        Good,
        Easy
    }
    public class FlashcardsResponseQualityRequest : ServiceRequest
    {
        public TranslationsRow Translation { get; set; }
        public ResponseQuality Quality { get; set; }
    }
}
