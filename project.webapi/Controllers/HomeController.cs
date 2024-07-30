using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace project.webapi.Controllers
{
    public class HomeController : Controller
    {
        // GET: HomeController
        public ActionResult Index()
        {
            return View();
        }

    }
}
