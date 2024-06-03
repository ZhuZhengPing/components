using c__components.Filter;
using c__components.Helper;
using c__components.Model;
using c__components.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Reflection;

namespace c__components.Controllers
{
    
    [Route("api/[controller]/[action]")]
    [ApiController]
    [ServiceFilter(typeof(TokenAttribute))]
    public class SelectController : ControllerBase
    {
        private DapperHelper _dapper;
        private SelectRepository _select;
        public SelectController(DapperHelper dapper, SelectRepository select)
        {
            this._dapper = dapper;
            this._select = select;
        }

        [HttpPost]     
        public async Task<dynamic> Select(GetByIDAndTable model)
        {
            return await _select.Select(model);
        }

        [HttpPost]
        public async Task<IEnumerable<dynamic>> SelectList(GetByIDAndTableString model)
        {
            return await _select.SelectList(model);
        }

        [HttpPost]
        public async Task<DapperPageModel<dynamic>> SelectListPages(GetPageList model)
        {
            return await _select.SelectListPages(model);
        }
    }
}
