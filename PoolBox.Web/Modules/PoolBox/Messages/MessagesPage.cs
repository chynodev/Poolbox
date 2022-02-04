using Serenity;
using Serenity.Web;
using Microsoft.AspNetCore.Mvc;

namespace PoolBox.PoolBox.Pages
{

    [PageAuthorize(typeof(Entities.MessagesRow))]
    public class MessagesController : Controller
    {
        [Route("PoolBox/Messages")]
        public ActionResult Index()
        {
            return View("~/Modules/PoolBox/Messages/MessagesIndex.cshtml");
        }
    }
}