using System.Web.Mvc;
using SS.BL.Users;

namespace SS.UI.Web.MVC.Controllers
{
    public class HomeController : Controller
    {
        UserManager userManager = new UserManager();
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

    }
}
