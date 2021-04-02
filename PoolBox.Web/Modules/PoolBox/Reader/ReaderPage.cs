using Serenity;
using Serenity.Web;
using Microsoft.AspNetCore.Mvc;

namespace PoolBox.PoolBox.Pages
{

    //[PageAuthorize(typeof(Entities.TranslationsRow))]
    public class ReaderController : Controller
    {
        [Route("PoolBox/Reader")]
        public ActionResult Index()
        {
            return View("~/Modules/PoolBox/Reader/ReaderIndex.cshtml");
        }
    }
}