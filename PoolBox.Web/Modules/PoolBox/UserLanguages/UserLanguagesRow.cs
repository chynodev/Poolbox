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
    [ConnectionKey("Default"), Module("PoolBox"), TableName("[dbo].[USER_LANGUAGES]")]
    [DisplayName("User Languages"), InstanceName("User Languages")]
    [ReadPermission(PermissionKeys.TranslationsRead)]
    [ModifyPermission(PermissionKeys.TranslationsWrite)]
    public sealed class UserLanguagesRow : Row<UserLanguagesRow.RowFields>, IIdRow, INameRow
    {
        [DisplayName("Id"), Column("ID"), Identity, IdProperty]
        public Int32? Id
        {
            get => fields.Id[this];
            set => fields.Id[this] = value;
        }

        [DisplayName("Code"), Column("CODE"), Size(3), NotNull, QuickSearch, NameProperty]
        public String Code
        {
            get => fields.Code[this];
            set => fields.Code[this] = value;
        }

        [DisplayName("Name"), Column("NAME"), Size(20), NotNull]
        public String Name
        {
            get => fields.Name[this];
            set => fields.Name[this] = value;
        }

        public UserLanguagesRow()
            : base()
        {
        }

        public UserLanguagesRow(RowFields fields)
            : base(fields)
        {
        }

        public class RowFields : RowFieldsBase
        {
            public Int32Field Id;
            public StringField Code;
            public StringField Name;
        }
    }
}
