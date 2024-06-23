using c__components.Helper;
using c__components.Model;
using System.Data.SqlClient;
using System.Data;

namespace c__components.Repository
{
    
    public class AddRepository
    {
        private DapperHelper _dapper;
        private LogRepository _log;
        public AddRepository(DapperHelper dapper, LogRepository log)
        {
            this._dapper = dapper;
            _log = log;
        }

        public async Task<int> Add(UpdateModel model , IDbTransaction tran, SqlConnection conn)
        {
            List<string> fields = new List<string>();
            List<object> values = new List<object>();
            foreach (var tempKey in model.Values)
            {
                fields.Add(tempKey.Key);
                values.Add(tempKey.Value);
            }
            string sql = $@"
                insert into {model.TableName}({string.Join(",", fields)})
                values({string.Join(",", values.Select(p=>"'"+p+"'"))})
            ";
            
            int result = await _dapper.Execute(sql, tran, conn);
            if (result == 0)
            {
                throw new Exception("添加实体失败，请检查网络");
            }

            result = await _log.AddAddLog(model, tran, conn);
            if (result == 0)
            {
                throw new Exception("添加日志失败，请检查网络");
            }
                    
            return result;
        }
    }
}
