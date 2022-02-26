using PoolBox.Administration;
using Serenity.Navigation;
using MyPages = PoolBox.PoolBox.Pages;

[assembly: NavigationLink(100, "PoolBox/Translations", typeof(MyPages.TranslationsController), icon: null)]
[assembly: NavigationLink(120, "PoolBox/Reader", typeof(MyPages.ReaderController), icon: null)]
[assembly: NavigationLink(130, "PoolBox/Flashcards", typeof(MyPages.FlashcardsController), icon: null)]
[assembly: NavigationLink(140, "PoolBox/Language Pairs", typeof(MyPages.LanguagePairsController), Permission = PermissionKeys.Security)]
//[assembly: NavigationLink(int.MaxValue, "PoolBox/User Languages", typeof(MyPages.UserLanguagesController), icon: null)]
[assembly: NavigationLink(int.MaxValue, "PoolBox/Inbox", typeof(MyPages.MessagesController), icon: null)]