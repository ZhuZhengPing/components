using c__components.Helper;
using c__components.Model;
using System.Data.SqlClient;
using System.Data;

namespace c__components.Repository
{
    public class UpdateRepository
    {
        private DapperHelper _dapper;
        LogRepository _log;
        public UpdateRepository(DapperHelper dapper, LogRepository log)
        {
            this._dapper = dapper;
            _log = log;
        }

        public async Task<int> Update(UpdateModel model, IDbTransaction tran, SqlConnection conn)
        {
            int result = 0;
            List<string> values = new List<string>();
            foreach (var tempKey in model.Values)
            {
                if (tempKey.Key == "CreateUserName")
                {
                    continue;
                }
                values.Add($"{tempKey.Key}='{tempKey.Value}'");
            }
            string sql = $"update {model.TableName} set {string.Join(",", values)} where ID={model.ID}";
            result = await _dapper.Execute(sql, tran, conn);
            if (result == 0)
            {
                throw new Exception("修改实体失败，请检查网络");
            }
            result = await _log.AddUploadLog(model, tran, conn);
            if (result == 0)
            {
                throw new Exception("添加日志失败，请检查网络");
            }
            return result;
        }
    }
}
