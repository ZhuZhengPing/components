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
        private TableRepository _table;
        public SelectController(DapperHelper dapper, SelectRepository select, TableRepository table)
        {
            this._dapper = dapper;
            this._select = select;
            this._table = table;
        }

        [HttpPost]     
        public async Task<dynamic> Select(GetByIDAndTable model)
        {
            return await _select.Select(model);
        }

        [HttpPost]
        public async Task<IEnumerable<dynamic>> SelectList(GetByIDAndTableString model)
        {
            if (string.IsNullOrWhiteSpace(model.OrderBy))
            {
                var entityTable = await _table.GetTableFields(model.TableName);
                if (entityTable.Any(p => p.FiledName == "OrderNum"))
                {
                    model.OrderBy = "OrderNum desc";
                }
                else
                {
                    model.OrderBy = "ID desc";
                }
            }
            return await _select.SelectList(model);
        }

        [HttpPost]
        public async Task<DapperPageModel<dynamic>> SelectListPages(GetPageList model)
        {
            if (string.IsNullOrWhiteSpace(model.OrderBy))
            {
                var entityTable = await _table.GetTableFields(model.TableName);
                if (entityTable.Any(p => p.FiledName == "OrderNum"))
                {
                    model.OrderBy = "OrderNum desc,ID desc";
                }
                else
                {
                    model.OrderBy = "ID desc";
                }
            }
            return await _select.SelectListPages(model);
        }
    }
}
