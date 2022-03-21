using Serenity;
using Serenity.Web;
using Microsoft.AspNetCore.Mvc;

namespace PoolBox.PoolBox.Pages
{

    [PageAuthorize(typeof(Entities.MessagesRow))]
    public class LibraryController : Controller
    {
        [Route("PoolBox/Library")]
        public ActionResult Index()
        {
            return View("~/Modules/PoolBox/Library/LibraryIndex.cshtml");
        }
    }
}