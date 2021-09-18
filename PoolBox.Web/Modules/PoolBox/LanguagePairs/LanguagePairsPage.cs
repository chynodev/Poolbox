using Serenity;
using Serenity.Web;
using Microsoft.AspNetCore.Mvc;

namespace PoolBox.PoolBox.Pages
{

    [PageAuthorize(typeof(Entities.LanguagePairsRow))]
    public class LanguagePairsController : Controller
    {
        [Route("PoolBox/LanguagePairs")]
        public ActionResult Index()
        {
            return View("~/Modules/PoolBox/LanguagePairs/LanguagePairsIndex.cshtml");
        }
    }
}