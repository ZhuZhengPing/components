using c__components.Model;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;
using c__components.Helper;

namespace c__components.Repository
{
    public class LogRepository
    {
        private TableRepository _table;
        private SelectRepository _select;
        private DapperHelper _dapper;
        public LogRepository(TableRepository table,SelectRepository select, DapperHelper dapper) 
        {
            this._table = table;
            this._select = select;
            this._dapper = dapper;
        }

        public async Task<int> AddAddLog(UpdateModel model, IDbTransaction tran, SqlConnection conn)
        {
            var tables = await _table.GetTableFields(model.TableName);
            var logNameRow = tables.FirstOrDefault(p => p.FiledName.EndsWith("Name") && p.FiledName != "CreateUserName");
            string logName = string.Empty;
            if (logNameRow != null)
            {
                logName = logNameRow.FiledText;
            }
            string tableRemark = await _table.GetTableRemark(model.TableName);
            string remark = $"添加{tableRemark}{logName}";

            AkdLogMain loginMain = new AkdLogMain();
            loginMain.TableName = model.TableName;
            loginMain.LogType = 1;
            loginMain.Remark = remark;
            var userItem = model.Values.FirstOrDefault(p => p.Key == "CreateUserName");
            loginMain.CreateUserName = userItem.Value.ToString();
            return await AddAkdLogMain(loginMain, tran, conn);
        }

        public async Task<int> AddUploadLog(UpdateModel model, IDbTransaction tran, SqlConnection conn)
        {
            var tables = await _table.GetTableFields(model.TableName);
            var logNameRow = tables.FirstOrDefault(p => p.FiledName.EndsWith("Name") && p.FiledName != "CreateUserName");
            string logName = string.Empty;
            if (logNameRow != null)
            {
                logName = logNameRow.FiledText;
            }
            string tableRemark = await _table.GetTableRemark(model.TableName);
            string remark = $"修改{tableRemark}{logName}";

            var UpdateUserNameModel = model.Values.FirstOrDefault(p => p.Key == "CreateUserName");

            AkdLogMain loginMain = new AkdLogMain();
            loginMain.TableName = model.TableName;
            loginMain.LogType = 2;
            loginMain.Remark = remark;
            loginMain.CreateUserName = UpdateUserNameModel.Value.ToString();
            int akdLogMainId = await AddAkdLogMain(loginMain, tran, conn);
            if (akdLogMainId == 0)
            {
                return 0;
            }
            List<AkdLogDetail> details = new List<AkdLogDetail>();

            GetByIDAndTable getById = new GetByIDAndTable();
            getById.TableName = model.TableName;
            getById.ID = model.ID;
            var instance = _select.Select(getById);

            foreach (var tempKey in model.Values)
            {
                AkdLogDetail d = new AkdLogDetail();
                d.AkdLogMainID = akdLogMainId;
                d.OldValue = GetPropertyValue(instance, tempKey.Key);
                d.NewValue = tempKey.Value.ToString();
                d.FiledName = tempKey.Key;
                var tempTable = tables.FirstOrDefault(p => p.FiledName == d.FiledName);
                if (tempTable != null)
                {
                    d.FileText = tempTable.FiledText;
                }
                details.Add(d);
            }
            int result = await AddAkdLogDetail(details, tran, conn);
            if (result == 0)
            {
                return 0;
            }
            return await AddUpdateAkdLogRollBack(model, details, akdLogMainId, tran, conn);
        }

        public async Task<int> AddDeleteLog(UpdateByIDAndTable model, IDbTransaction tran, SqlConnection conn)
        {
            var tables = await _table.GetTableFields(model.TableName);
            var logNameRow = tables.FirstOrDefault(p => p.FiledName.EndsWith("Name") && p.FiledName != "CreateUserName");
            string logName = string.Empty;
            if (logNameRow != null)
            {
                logName = logNameRow.FiledText;
            }
            string tableRemark = await _table.GetTableRemark(model.TableName);
            string remark = $"删除{tableRemark}{logName}";

            AkdLogMain loginMain = new AkdLogMain();
            loginMain.TableName = model.TableName;
            loginMain.LogType = 3;
            loginMain.Remark = remark;
            loginMain.CreateUserName = model.UserName;
            int akdLogMainId = await AddAkdLogMain(loginMain, tran, conn);
            if (akdLogMainId == 0)
            {
                return 0;
            }
            return await AddDeleteAkdLogRollBack(model, akdLogMainId, tran, conn);
        }

        public async Task<int> AddAkdLogMain(AkdLogMain model, IDbTransaction tran, SqlConnection conn)
        {
            string sql = @"
                insert into AkdLogMain(TableName,LogType,Remark,CreateUserName)
                values(@TableName,@LogType,@Remark,@CreateUserName)

                select @@identity
            ";
            return await this._dapper.Query<int>(sql, model, tran, conn);
        }

        public async Task<int> AddAkdLogDetail(IEnumerable<AkdLogDetail> list, IDbTransaction tran, SqlConnection conn)
        {
            string sql = @"
                insert into AkdLogDetail(AkdLogMainID,FiledName,FileRemark,OldValue,NewValue)
                values(@AkdLogMainID,@FiledName,@FileRemark,@OldValue,@NewValue)
            ";
            return await this._dapper.Query<int>(sql, list, tran, conn);
        }

        private async Task<int> AddUpdateAkdLogRollBack(UpdateModel model, IEnumerable<AkdLogDetail> list, int akdLogMainId, IDbTransaction tran, SqlConnection conn)
        {
            List<string> tempList = new List<string>();
            foreach (AkdLogDetail detail in list)
            {
                tempList.Add($"{detail.FiledName}='{detail.OldValue}'");
            }
            string tempUpdateSet = string.Join(",", tempList);

            AkdLogRollBack rb = new AkdLogRollBack();
            rb.RollBackSql = $"update {model.TableName} set {tempUpdateSet} where ID={model.ID}";
            rb.AkdLogMainID = akdLogMainId;

            string sql = $@"
                insert into AkdLogRollBack(AkdLogMainID,RollBackSql)
                values(@AkdLogMainID,@RollBackSql)
            ";
            return await this._dapper.Execute(sql, rb, tran, conn);
        }

        private async Task<int> AddDeleteAkdLogRollBack(UpdateByIDAndTable model, int akdLogMainId, IDbTransaction tran, SqlConnection conn)
        {
            IEnumerable<AkdTable> tableFields = await _table.GetTableFields(model.TableName);

            GetByIDAndTable getById = new GetByIDAndTable();
            getById.TableName = model.TableName;
            getById.ID = model.ID;
            var instance = await _select.Select(getById);

            string fields = string.Join(",", tableFields.Select(p => p.FiledName));
            string values = GetTempValues(instance);

            AkdLogRollBack rb = new AkdLogRollBack();
            rb.RollBackSql = $@"
                SET IDENTITY_INSERT {model.TableName} ON
                insert into {model.TableName}({fields}) values({values})
                SET IDENTITY_INSERT {model.TableName} OFF
            ";
            rb.AkdLogMainID = akdLogMainId;

            string sql = $@"
                insert into AkdLogRollBack(AkdLogMainID,RollBackSql)
                values(@AkdLogMainID,@RollBackSql)
            ";
            return await this._dapper.Execute(sql, rb, tran, conn);
        }

        public string GetTempValues<T>(T obj)
        {
            PropertyInfo[] properties = typeof(T).GetProperties();
            var values = new string[properties.Length];
            for (int i = 0; i < properties.Length; i++)
            {
                values[i] = "'" + properties[i].GetValue(obj)?.ToString() + "'";
            }
            return string.Join(",", values);
        }

        public string GetPropertyValue(object obj, string propertyName)
        {
            // 获取属性信息
            PropertyInfo property = obj.GetType().GetProperty(propertyName);
            // 获取属性值
            object tempValue = property.GetValue(obj);
            if (tempValue == null)
            {
                return "";
            }
            return tempValue.ToString();
        }
    }
}
