using c__components.Filter;
using c__components.Helper;
using c__components.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;

namespace c__components.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [ServiceFilter(typeof(TokenAttribute))]
    public class LogController : ControllerBase
    {

        public LogController()
        {

        }
    }
}
