using PoolBox.Administration;
using Serenity.Navigation;
using Administration = PoolBox.Administration.Pages;

[assembly: NavigationMenu(9000, "Administration", icon: "fa-desktop", Permission = PermissionKeys.Security)]
[assembly: NavigationLink(9000, "Administration/Languages", typeof(Administration.LanguageController), icon: "fa-comments")]
[assembly: NavigationLink(9000, "Administration/Translations", typeof(Administration.TranslationController), icon: "fa-comment-o")]
[assembly: NavigationLink(9000, "Administration/Roles", typeof(Administration.RoleController), icon: "fa-lock")]
[assembly: NavigationLink(9000, "Administration/User Management", typeof(Administration.UserController), icon: "fa-users", Permission = PermissionKeys.Security)]