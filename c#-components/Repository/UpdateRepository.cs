using c__components.Helper;
using c__components.Model;
using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace c__components.Repository
{
    public class UpdateRepository
    {
        private DapperHelper _dapper;
        private LogRepository _log;
        private SelectRepository _select;
        public UpdateRepository(DapperHelper dapper, LogRepository log, SelectRepository select)
        {
            this._dapper = dapper;
            _select = select;
            this._log = log;
        }

        public async Task<int> Update(UpdateModel model, IDbTransaction tran, SqlConnection conn)
        {
            int result = 0;

            IEnumerable<dynamic> fields = await _select.SelectList(new GetByIDAndTableString()
            {
                TableName = "AkdTable",
                Where = $" IsInEdit=1 and TableName='{model.TableName}' "
            });

            List<string> values = new List<string>();
            if (fields != null)
            {
                foreach (var item in model.Values)
                {
                    if (fields.Any(p => p.FieldName == item.Key))
                    {
                        values.Add($"{item.Key}='{item.Value}'");
                    }
                }
            }

            result = await _log.AddUploadLog(model, tran, conn);
            if (result == 0)
            {
                throw new Exception("添加日志失败，请检查网络");
            }

            string sql = $"update {model.TableName} set {string.Join(",", values)} where ID={model.ID}";
            result = await _dapper.Execute(sql, tran, conn);
            if (result == 0)
            {
                throw new Exception("修改实体失败，请检查网络");
            }
            return result;
        }
    }
}
