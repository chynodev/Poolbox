using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;
using System.IO;

namespace PoolBox.PoolBox.Entities
{
    [ConnectionKey("Default"), Module("PoolBox"), TableName("[dbo].[MESSAGES]")]
    [DisplayName("Messages"), InstanceName("Messages")]
    [ReadPermission("Administration:General")]
    [ModifyPermission("Administration:General")]
    public sealed class MessagesRow : Row<MessagesRow.RowFields>, IIdRow, INameRow
    {
        [DisplayName("Id"), Column("ID"), NotNull, IdProperty]
        public Int32? Id
        {
            get => fields.Id[this];
            set => fields.Id[this] = value;
        }

        [DisplayName("Sender Id"), Column("SENDER_ID"), NotNull]
        public Int32? SenderId
        {
            get => fields.SenderId[this];
            set => fields.SenderId[this] = value;
        }

        [DisplayName("Recipient Id"), Column("RECIPIENT_ID"), NotNull]
        public Int32? RecipientId
        {
            get => fields.RecipientId[this];
            set => fields.RecipientId[this] = value;
        }

        [DisplayName("Content"), Column("CONTENT"), Size(500), NotNull, QuickSearch, NameProperty]
        public String Content
        {
            get => fields.Content[this];
            set => fields.Content[this] = value;
        }

        [DisplayName("Is Read"), Column("IS_READ"), NotNull]
        public Int16? IsRead
        {
            get => fields.IsRead[this];
            set => fields.IsRead[this] = value;
        }

        [DisplayName("Sent Date"), Column("SENT_DATE"), NotNull]
        public DateTime? SentDate
        {
            get => fields.SentDate[this];
            set => fields.SentDate[this] = value;
        }

        public MessagesRow()
            : base()
        {
        }

        public MessagesRow(RowFields fields)
            : base(fields)
        {
        }

        public class RowFields : RowFieldsBase
        {
            public Int32Field Id;
            public Int32Field SenderId;
            public Int32Field RecipientId;
            public StringField Content;
            public Int16Field IsRead;
            public DateTimeField SentDate;
        }
    }
}
