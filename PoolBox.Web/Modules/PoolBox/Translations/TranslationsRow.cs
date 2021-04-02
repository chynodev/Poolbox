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

        [DisplayName("Translated"), Column("TRANSLATED"), Size(50), NotNull]
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

        [DisplayName("Pair Translate From"), Expression("jPair.[TRANSLATE_FROM]")]
        public String PairTranslateFrom
        {
            get => fields.PairTranslateFrom[this];
            set => fields.PairTranslateFrom[this] = value;
        }

        [DisplayName("Pair Translate To"), Expression("jPair.[TRANSLATE_TO]")]
        public String PairTranslateTo
        {
            get => fields.PairTranslateTo[this];
            set => fields.PairTranslateTo[this] = value;
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
            public StringField Translated;
            public Int64Field PairId;

            public StringField PairTranslateFrom;
            public StringField PairTranslateTo;
        }
    }
}
