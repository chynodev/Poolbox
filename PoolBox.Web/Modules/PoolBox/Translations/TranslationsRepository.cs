using PoolBox.Common;
using PoolBox.Common.Repositories;
using Serenity;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Data;
using MyRow = PoolBox.PoolBox.Entities.TranslationsRow;

namespace PoolBox.PoolBox.Repositories
{
    public class TranslationsRepository : BaseRepository
    {
        private static MyRow.RowFields Fld => MyRow.Fields;

        public TranslationsRepository(IRequestContext context)
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

        private class MySaveHandler : SaveRequestHandler<MyRow> 
        {
            public MySaveHandler(IRequestContext context)
                : base(context)
            {
            }

            protected override void BeforeSave()
            {
                base.BeforeSave();

                Row.UserId = Int32.Parse(Context.User.GetIdentifier());
                if (!Row.PairId.HasValue)
                    Row.PairId = LanguagePairsRepository.GetCurrentId(Connection, Context);
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

            protected override void ApplyEqualityFilter(SqlQuery query)
            {
                base.ApplyEqualityFilter(query);

                var languagePairId = LanguagePairsRepository.GetCurrentId(Connection, Context);

                query.Where(
                    new Criteria(MyRow.Fields.UserId) == Context.User.GetIdentifier()
                    && new Criteria(MyRow.Fields.PairId) == languagePairId
                );
            }
        }
    }
}