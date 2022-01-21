using PoolBox.Common;
using PoolBox.Common.Repositories;
using Serenity;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Data;
using System.Linq;
using MyRow = PoolBox.PoolBox.Entities.LanguagePairsRow;

namespace PoolBox.PoolBox.Repositories
{
    public class LanguagePairsRepository : BaseRepository
    {
        private static MyRow.RowFields Fld => MyRow.Fields;

        public LanguagePairsRepository(IRequestContext context)
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

        public static int GetCurrentId(IDbConnection connection, IRequestContext context)
        {
            return Int32.Parse(new UserPreferenceRepository(context)
                    .Retrieve(
                        connection,
                        new UserPreferenceRetrieveRequest { PreferenceType = "LanguagePairPreference", Name = "Language pair ID" }
                    ).Value);
        }

        public static MyRow GetCurrent(IDbConnection connection, IRequestContext context)
        {
            return connection
                .List<MyRow>()
                .FirstOrDefault(
                    x => x.PairId == GetCurrentId(connection, context)
                );
        }

        public static MyRow GetByLanguageCodes(IDbConnection connection, IRequestContext context, string originalLngCode, string targetLngCode)
        {
            return connection
                .List<MyRow>(
                    new Criteria(MyRow.Fields.TranslateFrom) == targetLngCode &&
                    new Criteria(MyRow.Fields.TranslateTo) == originalLngCode
                ).FirstOrDefault();
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