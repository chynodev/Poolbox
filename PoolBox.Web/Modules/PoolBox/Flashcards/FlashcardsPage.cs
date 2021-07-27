using Serenity;
using Serenity.Web;
using Microsoft.AspNetCore.Mvc;

namespace PoolBox.PoolBox.Pages
{

    [PageAuthorize(typeof(Entities.TranslationsRow))]
    public class FlashcardsController : Controller
    {
        [Route("PoolBox/Flashcards")]
        public ActionResult Index()
        {
            return View("~/Modules/PoolBox/Flashcards/FlashcardsIndex.cshtml");
        }
    }
}