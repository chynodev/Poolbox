using PoolBox.Administration;
using PoolBox.Administration.Entities;
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
    [ReadPermission(PermissionKeys.TranslationsRead)]
    [ModifyPermission(PermissionKeys.TranslationsWrite)]
    public sealed class MessagesRow : Row<MessagesRow.RowFields>, IIdRow, INameRow
    {
        [DisplayName("Id"), Column("ID"), IdProperty]
        public Int32? Id
        {
            get => fields.Id[this];
            set => fields.Id[this] = value;
        }

        [DisplayName("Sender Id"), Column("SENDER_ID"), NotNull, ForeignKey("[dbo].[Users]", "UserId", RowType = typeof(UserRow)), LeftJoin("jSender")]
        public Int32? SenderId
        {
            get => fields.SenderId[this];
            set => fields.SenderId[this] = value;
        }

        [DisplayName("Sender Name"), Origin("jSender", "Username")]
        public String SenderName
        {
            get => fields.SenderName[this];
            set => fields.SenderName[this] = value;
        }

        [DisplayName("Sender Name"), Origin("jSender", "DisplayName")]
        public String SenderDisplayName
        {
            get => fields.SenderDisplayName[this];
            set => fields.SenderDisplayName[this] = value;
        }

        [DisplayName("Recipient Id"), Column("RECIPIENT_ID"), ForeignKey("[dbo].[Users]", "UserId", RowType = typeof(UserRow)), LeftJoin("jRecipient")]
        public Int32? RecipientId
        {
            get => fields.RecipientId[this];
            set => fields.RecipientId[this] = value;
        }

        [DisplayName("Recipient Name"), Origin("jRecipient", "Username")]
        public String RecipientName
        {
            get => fields.RecipientName[this];
            set => fields.RecipientName[this] = value;
        }

        [DisplayName("Recipient Name"), Origin("jRecipient", "DisplayName")]
        public String RecipientDisplayName
        {
            get => fields.RecipientDisplayName[this];
            set => fields.RecipientDisplayName[this] = value;
        }

        [DisplayName("Content"), Column("CONTENT"), Size(500), NotNull, QuickSearch, NameProperty]
        public String Content
        {
            get => fields.Content[this];
            set => fields.Content[this] = value;
        }

        [DisplayName("Is Read"), Column("IS_READ")]
        public Int16? IsRead
        {
            get => fields.IsRead[this];
            set => fields.IsRead[this] = value;
        }

        [DisplayName("Is Vocabulary"), Column("IS_VOCABULARY")]
        public Boolean? IsVocabulary
        {
            get => fields.IsVocabulary[this];
            set => fields.IsVocabulary[this] = value;
        }

        [DisplayName("Sent Date"), Column("SENT_DATE")]
        public DateTime? SentDate
        {
            get => fields.SentDate[this];
            set => fields.SentDate[this] = value;
        }

        [DisplayName("Name"), NotMapped]
        public String VocabularyName
        {
            get => fields.VocabularyName[this];
            set => fields.VocabularyName[this] = value;
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
            public BooleanField IsVocabulary;
            public DateTimeField SentDate;

            public StringField SenderName;
            public StringField RecipientName;
            public StringField SenderDisplayName;
            public StringField RecipientDisplayName;
            public StringField VocabularyName;
        }
    }
}
