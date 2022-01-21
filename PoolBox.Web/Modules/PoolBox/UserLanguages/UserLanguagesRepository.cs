using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PoolBox.Common;
using PoolBox.Common.Repositories;
using PoolBox.PoolBox.Entities;
using PoolBox.Requests;
using PoolBox.Responses;
using Serenity;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Data;
using System.Linq;
using MyRow = PoolBox.PoolBox.Entities.UserLanguagesRow;

namespace PoolBox.PoolBox.Repositories
{
    public class UserLanguagesRepository : BaseRepository
    {
        private static MyRow.RowFields Fld => MyRow.Fields;

        public UserLanguagesRepository([FromServices] IRequestContext context)
            : base(context)
        {
        }

        public SaveResponse Create(IUnitOfWork uow, SaveRequest<MyRow> request)
        {
            return new MySaveHandler(Context).Process(uow, request, SaveRequestType.Create);
        }

        public SaveResponse Update(IUnitOfWork uow, SaveRequest<MyRow> request)
        {
            return new MySaveHandler(Context).Process(uow, request, SaveRequestType.Update);
        }

        public DeleteResponse Delete(IUnitOfWork uow, DeleteRequest request)
        {
            return new MyDeleteHandler(Context).Process(uow, request);
        }

        public RetrieveResponse<MyRow> Retrieve(IDbConnection connection, RetrieveRequest request)
        {
            return new MyRetrieveHandler(Context).Process(connection, request);
        }

        public ListResponse<MyRow> List(IDbConnection connection, ListRequest request)
        {
            return new MyListHandler(Context).Process(connection, request);
        }

        public static MyRow GetByCode(IDbConnection connection, IRequestContext context, string code)
        {
            return connection.List<MyRow>(
                    new Criteria(MyRow.Fields.Code) == code
                ).FirstOrDefault();
        }


        public LanguageSelectionResponse DropDownFeed(ListRequest request, IConfiguration configuration)
        {
            var sqlConnStrings = Common.DbConnectionHelper.GetDefaultSqlConnections(configuration);
            
            using (var connection = sqlConnStrings.NewByKey("Default"))
            {
                var languagePair = LanguagePairsRepository.GetCurrent(connection, Context);
                var originalLanguageId = UserLanguagesRepository.GetByCode(connection, Context, languagePair.TranslateTo)?.Id;
                var targetLanguageId = UserLanguagesRepository.GetByCode(connection, Context, languagePair.TranslateFrom)?.Id;

                if (originalLanguageId == null || targetLanguageId == null)
                    return new LanguageSelectionResponse();

                var resp = new LanguageSelectionResponse
                {
                    Languages = new MyListHandler(Context).Process(connection, request).Entities,
                    OriginalLanguageId = (int) originalLanguageId,
                    TargetLanguageId = (int) targetLanguageId
                };
                return resp;
            }
        }

        public SaveResponse SaveLanguageSelection(IUnitOfWork uow, LanguageSelectionRequest request)
        {
            var response = new SaveResponse();

            if (request.OriginalLanguageId == request.TargetLanguageId)
            {
                response.Error = new ServiceError { Message = "Selected languages have to be different." };
                return response;
            }
            var originalLanguageCode = uow.Connection.ById<MyRow>(request.OriginalLanguageId).Code;
            var targetLanguageCode = uow.Connection.ById<MyRow>(request.TargetLanguageId).Code;

            var pairId = LanguagePairsRepository.GetByLanguageCodes(uow.Connection, Context, originalLanguageCode, targetLanguageCode)?.PairId;
            if (pairId == null)
            {
                response = new LanguagePairsRepository(Context).Create(
                    uow,
                    new SaveRequest<LanguagePairsRow>
                    {
                        Entity = new LanguagePairsRow
                        {
                            TranslateFrom = targetLanguageCode,
                            TranslateTo = originalLanguageCode
                        }
                    });
                pairId = (long)response.EntityId;
            }
            new UserPreferenceRepository(Context).Update(
                uow,
                new UserPreferenceUpdateRequest
                {
                    Name = UserPreferenceConstants.LANGUAGE_PAIR_ID,
                    PreferenceType = UserPreferenceConstants.LANGUAGE_PAIR_PREFERENCE,
                    Value = pairId?.ToString()
                }
            );
            return response;
        }

        private class MySaveHandler : SaveRequestHandler<MyRow> 
        {
            public MySaveHandler(IRequestContext context)
                : base(context)
            {
            }
        }
        
        private class MyDeleteHandler : DeleteRequestHandler<MyRow> 
        {
            public MyDeleteHandler(IRequestContext context)
                : base(context)
            {
            }
        }

        private class MyRetrieveHandler : RetrieveRequestHandler<MyRow> 
        {
            public MyRetrieveHandler(IRequestContext context)
                : base(context)
            {
            }
        }
        
        private class MyListHandler : ListRequestHandler<MyRow> 
        {
            public MyListHandler(IRequestContext context)
                : base(context)
            {
            }
        }
    }
}