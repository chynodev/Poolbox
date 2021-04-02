using Serenity;
using Serenity.Web;
using Microsoft.AspNetCore.Mvc;

namespace PoolBox.PoolBox.Pages
{

    [PageAuthorize(typeof(Entities.TranslationsRow))]
    public class TranslationsController : Controller
    {
        [Route("PoolBox/Translations")]
        public ActionResult Index()
        {
            return View("~/Modules/PoolBox/Translations/TranslationsIndex.cshtml");
        }
    }
}