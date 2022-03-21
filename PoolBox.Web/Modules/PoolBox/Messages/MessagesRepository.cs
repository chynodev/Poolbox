using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PoolBox.Administration.Repositories;
using Serenity;
using Serenity.Data;
using Serenity.Services;
using System;
using System.Data;
using System.Linq;
using MyRow = PoolBox.PoolBox.Entities.MessagesRow;

namespace PoolBox.PoolBox.Repositories
{
    public class MessagesRepository : BaseRepository
    {
        private static MyRow.RowFields Fld => MyRow.Fields;

        public MessagesRepository([FromServices] IRequestContext context)
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

        public MyRow CreateWithoutConnection(string senderName, string receiverName, string messageContent, bool isVocabulary)
        {
            MyRow row = null;
            int newRowId;

            var sqlConnStrings = Common.DbConnectionHelper.GetDefaultSqlConnections(null);
            using (var conn = sqlConnStrings.NewByKey("Default"))
            {
                var senderId = new UserRepository(Context).GetByUsername(conn, senderName).UserId;
                var receiverId = new UserRepository(Context).GetByUsername(conn, receiverName)?.UserId;

                using (var uow = new UnitOfWork(conn))
                {
                    newRowId = (int)conn.InsertAndGetID(
                        new MyRow
                            {
                                SenderId = senderId,
                                RecipientId = receiverId,
                                Content = messageContent.TrimEnd(),
                                IsVocabulary = isVocabulary
                            }
                       );

                    uow.Commit();
                }
                if (newRowId < 0)
                    return null;

                row = conn.ById<MyRow>(newRowId);
                if(row.RecipientId != null)
                    row.RecipientName = conn.ById<Administration.Entities.UserRow>(row.RecipientId)?.Username;
                row.SenderName = conn.ById<Administration.Entities.UserRow>(row.SenderId).Username;
            }
            return row;
        }

        public ListResponse<MyRow> ListWithoutConnection(IConfiguration config)
        {
            var sqlConnStrings = Common.DbConnectionHelper.GetDefaultSqlConnections(config);

            using (var conn = sqlConnStrings.NewByKey("Default"))
            {
                return new MyListHandler(Context).Process(conn, null);
            }
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

            //protected override void ApplyEqualityFilter(SqlQuery query)
            //{
            //    base.ApplyEqualityFilter(query);

            //    var userId = Context.User.GetIdentifier();

            //    query.Where(
            //        new Criteria(MyRow.Fields.RecipientId) == userId
            //        || new Criteria(MyRow.Fields.SenderId) == userId
            //    );
            //}
        }
    }
}