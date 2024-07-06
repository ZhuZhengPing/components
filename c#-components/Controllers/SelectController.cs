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
                if (entityTable.Any(p => p.FieldName == "OrderNum"))
                {
                    model.OrderBy = "OrderNum desc";
                }
                else
                {
                    model.OrderBy = "ID";
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
                if (entityTable.Any(p => p.FieldName == "OrderNum"))
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

        [HttpPost]
        public async Task<IEnumerable<dynamic>> SelectTreeList(GetByIDAndTableString model)
        {
            if (string.IsNullOrWhiteSpace(model.OrderBy))
            {
                var entityTable = await _table.GetTableFields(model.TableName);
                if (entityTable.Any(p => p.FieldName == "OrderNum"))
                {
                    model.OrderBy = "OrderNum desc";
                }
                else
                {
                    model.OrderBy = "ID";
                }
            }
            if (string.IsNullOrWhiteSpace(model.Where))
            {
                model.Where = "ParentID=0";
            }
            else
            {
                model.Where = model.Where + " and ParentID=0 ";
            }
            IEnumerable<dynamic> result = await _select.SelectList(model);
            if (result.Count() > 0)
            {
                string ids = string.Join(",", result.Select(p => p.ID));

                GetByIDAndTableString childrensModel = new GetByIDAndTableString();
                childrensModel.TableName = model.TableName;
                childrensModel.Where = $"ParentID in ({ids})";
                childrensModel.OrderBy = model.OrderBy;
                var childrens = await _select.SelectList(childrensModel);

                foreach (var item in result)
                {
                    item.children = childrens.Where(p => p.ParentID == item.ID);
                }
            }
            return result;
        }

        [HttpPost]
        public async Task<DapperPageModel<dynamic>> SelectTreeListPages(GetPageList model)
        {
            if (string.IsNullOrWhiteSpace(model.OrderBy))
            {
                var entityTable = await _table.GetTableFields(model.TableName);
                if (entityTable.Any(p => p.FieldName == "OrderNum"))
                {
                    model.OrderBy = "OrderNum desc";
                }
                else
                {
                    model.OrderBy = "ID";
                }
            }
            if(string.IsNullOrWhiteSpace(model.Where))
            {
                model.Where = "ParentID=0";
            }
            else
            {
                model.Where = model.Where + " and ParentID=0 ";
            }

            DapperPageModel<dynamic> result = await _select.SelectListPages(model);
            if (result.total > 0)
            {
                string ids = string.Join(",", result.data.Select(p => p.ID));

                GetByIDAndTableString childrensModel = new GetByIDAndTableString();
                childrensModel.TableName = model.TableName;
                childrensModel.Where = $"ParentID in ({ids})";
                childrensModel.OrderBy = model.OrderBy;
                var childrens = await _select.SelectList(childrensModel);
                
                foreach (var item in result.data)
                {
                    item.children = childrens.Where(p => p.ParentID == item.ID);
                }
            }
            return result;
        }
    }
}
