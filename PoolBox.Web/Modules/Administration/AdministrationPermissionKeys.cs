
using Serenity.ComponentModel;
using System.ComponentModel;

namespace PoolBox.Administration
{
    [NestedPermissionKeys]
    [DisplayName("Administration")]
    public class PermissionKeys
    {
        [Description("User, Role Management and Permissions")]
        public const string Security = "Administration:Security";

        [Description("Languages and Translations")]
        public const string Translation = "Administration:Translation";

        [Description("Translations:Read")]
        public const string TranslationsRead = "Translations:Read";
        [Description("Translations:Write")]
        public const string TranslationsWrite = "Translations:Write";
    }
}
