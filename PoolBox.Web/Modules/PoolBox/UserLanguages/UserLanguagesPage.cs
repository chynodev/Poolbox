using Serenity;
using Serenity.Web;
using Microsoft.AspNetCore.Mvc;

namespace PoolBox.PoolBox.Pages
{

    [PageAuthorize(typeof(Entities.UserLanguagesRow))]
    public class UserLanguagesController : Controller
    {
        [Route("PoolBox/UserLanguages")]
        public ActionResult Index()
        {
            return View("~/Modules/PoolBox/UserLanguages/UserLanguagesIndex.cshtml");
        }
    }
}