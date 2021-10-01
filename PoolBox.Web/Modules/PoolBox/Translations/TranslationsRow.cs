using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;
using System.IO;

namespace PoolBox.PoolBox.Entities
{
    [ConnectionKey("Default"), Module("PoolBox"), TableName("[dbo].[TRANSLATIONS]")]
    [DisplayName("Translations"), InstanceName("Translations")]
    [ReadPermission("Administration:General")]
    [ModifyPermission("Administration:General")]
    public sealed class TranslationsRow : Row<TranslationsRow.RowFields>, IIdRow, INameRow
    {
        [DisplayName("Tr Id"), Column("TR_ID"), Identity, IdProperty]
        public Int64? TrId
        {
            get => fields.TrId[this];
            set => fields.TrId[this] = value;
        }

        [DisplayName("Original"), Column("ORIGINAL"), Size(50), NotNull, QuickSearch, NameProperty]
        public String Original
        {
            get => fields.Original[this];
            set => fields.Original[this] = value;
        }

        [DisplayName("Translated"), Column("TRANSLATED"), Size(150), NotNull]
        public String Translated
        {
            get => fields.Translated[this];
            set => fields.Translated[this] = value;
        }

        [DisplayName("Pair"), Column("PAIR_ID"), NotNull, ForeignKey("[dbo].[LANGUAGE_PAIRS]", "PAIR_ID"), LeftJoin("jPair"), TextualField("PairTranslateFrom")]
        public Int64? PairId
        {
            get => fields.PairId[this];
            set => fields.PairId[this] = value;
        }

        [DisplayName("Noun Gender"), Column("NOUN_GENDER"), Size(50)]
        public String NounGender
        {
            get => fields.NounGender[this];
            set => fields.NounGender[this] = value;
        }

        [DisplayName("Word type"), Column("WORD_TYPE"), Size(50)]
        public String WordType
        {
            get => fields.WordType[this];
            set => fields.WordType[this] = value;
        }


        [DisplayName("User ID"), Column("USER_ID"), NotNull, ForeignKey("[dbo].[Users]", "UserId"), LeftJoin("jUser")]
        public Int32? UserId
        {
            get => fields.UserId[this];
            set => fields.UserId[this] = value;
        }

        [DisplayName("Username"), Expression("jUser.Username"), MinSelectLevel(SelectLevel.List)]
        public String Username
        {
            get => fields.Username[this];
            set => fields.Username[this] = value;
        }

        [DisplayName("Due date"), Column("DUE_DATE")]
        public DateTime? DueDate
        {
            get => fields.DueDate[this];
            set => fields.DueDate[this] = value;
        }

        [DisplayName("Easiness Factor"), Column("EASINESS_FACTOR")]
        public Single? EasinessFactor
        {
            get => fields.EasinessFactor[this];
            set => fields.EasinessFactor[this] = value;
        }

        [DisplayName("Repetition"), Column("REPETITION")]
        public Int32? Repetition
        {
            get => fields.Repetition[this];
            set => fields.Repetition[this] = value;
        }

        [DisplayName("Interval"), Column("INTERVAL")]
        public Int32? Interval
        {
            get => fields.Interval[this];
            set => fields.Interval[this] = value;
        }

        [DisplayName("Create date"), Column("CREATE_DATE")]
        public DateTime? CreateDate
        {
            get => fields.CreateDate[this];
            set => fields.CreateDate[this] = value;
        }

        [NotMapped, DefaultValue(false), MinSelectLevel(SelectLevel.List)]
        public Boolean? IsRepeated
        {
            get => fields.IsRepeated[this];
            set => fields.IsRepeated[this] = value;
        }

        [NotMapped, DisplayName("Error")]
        public String Error
        {
            get => fields.Error[this];
            set => fields.Error[this] = value;
        }

        public TranslationsRow()
            : base()
        {
        }

        public TranslationsRow(RowFields fields)
            : base(fields)
        {
        }

        public class RowFields : RowFieldsBase
        {
            public Int64Field TrId;
            public StringField Original;
            public StringField NounGender;
            public StringField WordType;
            public StringField Translated;
            public Int64Field PairId;
            public Int32Field UserId;
            public StringField Username;
            public DateTimeField CreateDate;
            public DateTimeField DueDate;
            public SingleField EasinessFactor;
            public Int32Field Repetition;
            public Int32Field Interval;
            public BooleanField IsRepeated;
         
            public StringField Error;
        }
    }
}
