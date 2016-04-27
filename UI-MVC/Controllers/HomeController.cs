using System.Web.Mvc;
using SS.BL.Domain.Users;
using SS.BL.Users;

namespace SS.UI.Web.MVC.Controllers
{
    public class HomeController : Controller
    {
        UserManager userManager = new UserManager();
        public ActionResult Index()
        {
            User user = userManager.ReadUser("test@test.com");
            ViewBag.Title = "Home Page";

            return View();
        }
    }
}
