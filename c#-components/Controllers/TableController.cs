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
        public async Task<IEnumerable<dynamic>> GetTableDetailBySql(GetByName model)
        {
            GetByIDAndTableString m = new GetByIDAndTableString();
            m.TableName = "AkdTable";
            m.Where = $" TableName='{model.Name}' ";
            IEnumerable<dynamic> akdTableList = await _select.SelectList(m);
            
            // 如果数据库有值，直接返回数据库
            if(akdTableList != null && akdTableList.Count() > 0)
            {
                return akdTableList;
            }


            IEnumerable<AkdTable> list = await _table.GetTableFields(model.Name);
            int index = 0;
            foreach (AkdTable table in list)
            {
                index++;

                table.IsRequest = !table.IsRequest;
                if (table.IsRequest == true)
                {
                    table.RequestPrompt = "请输入" + table.FieldText;
                }

                table.InTableWidth = 100;
                table.TableName = model.Name;
                table.IsInSearch = 1;
                table.IsInEdit = true;
                table.IsInTable = true;

                if (table.FieldName == "ID")
                {
                    table.IsInSearch = 0;
                    table.IsInEdit = false;
                    table.IsInTable = false;
                    table.RequestPrompt = "";
                }
                else if(table.FieldName == "CreateTime" || table.FieldName == "CreateUserName")
                {
                    table.IsInSearch = 0;
                    table.IsInEdit = false;
                    table.RequestPrompt = "";
                }

              

                switch (table.FieldType)
                {
                    case "char":
                    case "varchar":
                    case "nvarchar":
                        table.FieldType = "string";
                        break;
                    case "int":
                    case "smallint":
                    case "bigint":
                    case "decimal":
                    case "double":
                    case "float":
                        table.FieldType = "number";
                        break;
                    case "datetime":
                    case "date":
                        if (table.FieldName.EndsWith("Year"))
                        {
                            table.FieldType = "year";
                        }
                        else if (table.FieldName.EndsWith("Month"))
                        {
                            table.FieldType = "month";
                        }
                        break;
                }
                table.OrderNum = index * 10;
                    
                
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
