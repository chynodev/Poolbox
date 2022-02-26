using PoolBox.Administration;
using Serenity;
using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;
using System.IO;

namespace PoolBox.PoolBox.Entities
{
    [ConnectionKey("Default"), Module("PoolBox"), TableName("[dbo].[LANGUAGE_PAIRS]")]
    [DisplayName("Language Pairs"), InstanceName("Language Pairs")]
    [ReadPermission(PermissionKeys.TranslationsRead)]
    [ModifyPermission(PermissionKeys.TranslationsWrite)]
    [LookupScript("PoolBox.LanguagePairs")]
    public sealed class LanguagePairsRow : Row<LanguagePairsRow.RowFields>, IIdRow, INameRow
    {
        [DisplayName("Pair Id"), Column("PAIR_ID"), Identity, IdProperty, LookupInclude]
        public Int64? PairId
        {
            get => fields.PairId[this];
            set => fields.PairId[this] = value;
        }

        [DisplayName("Translate From"), Column("TRANSLATE_FROM"), Size(50), NotNull, QuickSearch, NameProperty, LookupInclude]
        public String TranslateFrom
        {
            get => fields.TranslateFrom[this];
            set => fields.TranslateFrom[this] = value;
        }

        [DisplayName("Translate To"), Column("TRANSLATE_TO"), Size(50), NotNull]
        public String TranslateTo
        {
            get => fields.TranslateTo[this];
            set => fields.TranslateTo[this] = value;
        }

        public LanguagePairsRow()
            : base()
        {
        }

        public LanguagePairsRow(RowFields fields)
            : base(fields)
        {
        }

        public class RowFields : RowFieldsBase
        {
            public Int64Field PairId;
            public StringField TranslateFrom;
            public StringField TranslateTo;
        }
    }
}
