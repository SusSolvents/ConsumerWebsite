using System.Web.Mvc;
using SS.BL.Domain.Users;
using SS.BL.Users;
using SS.DAL;
using SS.DAL.EFUsers;

namespace SS.UI.Web.MVC.Controllers
{
    public class HomeController : Controller
    {
        UserManager userManager = new UserManager(new UserRepository(new EFDbContext()));
        public ActionResult Index()
        {
            User user = userManager.ReadUser("test@test.com");
            ViewBag.Title = "Home Page";

            return View();
        }
    }
}
