using c__components.Filter;
using c__components.Helper;
using c__components.Model;
using c__components.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace c__components.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [ServiceFilter(typeof(TokenAttribute))]
    public class TableController : ControllerBase
    {
        DapperHelper _dapper;
        TableRepository _table;
        private SelectRepository _select;
        public TableController(DapperHelper dapper, TableRepository table, SelectRepository select) 
        {
            this._dapper = dapper;
            this._table = table;
            this._select = select;
        }

        [HttpPost]
        public async Task<IEnumerable<string>> GetTableList()
        {
            return await _dapper.ExecuteList<string>(" SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS order by TABLE_NAME ");
        }

        [HttpPost]
        public async Task<IEnumerable<AkdTable>> GetTableDetailBySql(GetByName model)
        {
            IEnumerable<AkdTable> list = await _table.GetTableFields(model.Name);

            GetByIDAndTableString m = new GetByIDAndTableString();
            m.TableName = model.Name;
            IEnumerable<dynamic> akdTableList = await _select.SelectList(m);
            
            int index = 0;
            foreach (AkdTable table in list)
            {
                index++;
                if (akdTableList.Any(p => p.FiledName == table.FiledName))
                {
                    var tempTable = table;
                    tempTable = akdTableList.FirstOrDefault(p => p.FiledName == table.FiledName);
                    continue;
                }

                table.InTableWidth = 100;
                table.TableName = model.Name;
                switch (table.FiledType)
                {
                    case "char":
                    case "varchar":
                    case "nvarchar":
                        table.FiledType = "string";
                        break;
                    case "int":
                    case "smallint":
                    case "bigint":
                    case "decimal":
                    case "double":
                    case "float":
                        table.FiledType = "number";
                        break;
                    case "datetime":
                    case "date":
                        if (table.FiledName.EndsWith("Year"))
                        {
                            table.FiledType = "year";
                        }
                        else if (table.FiledName.EndsWith("Month"))
                        {
                            table.FiledType = "month";
                        }
                        break;
                }
                table.OrderNum = index * 10;
                    
                if(table.IsRequest == true)
                {
                    table.RequestPrompt = "请输入" + table.FiledText;
                }
            }
            return list;
        }

        [HttpPost]
        public async Task<string> GetTableRemark(GetByName model)
        {
            return await _table.GetTableRemark(model.Name);
        }
    }
}
