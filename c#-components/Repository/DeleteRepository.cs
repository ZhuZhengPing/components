using c__components.Helper;
using c__components.Model;
using System.Data.SqlClient;
using System.Data;

namespace c__components.Repository
{
    public class DeleteRepository
    {
        private DapperHelper _dapper;
        private LogRepository _log;
        public DeleteRepository(DapperHelper dapper, LogRepository log)
        {
            _dapper = dapper;
            _log = log;
        }
        
        public async Task<int> Delete(UpdateByIDAndTable model, IDbTransaction tran, SqlConnection conn)
        {
            int result = 0;
            string sql = $" delete {model.TableName} where ID={model.ID} ";
            result = await _log.AddDeleteLog(model, tran, conn);
            if (result == 0)
            {
                throw new Exception("添加日志失败，请检查网络");
            }

            result = await _dapper.Execute(sql, model);
            if (result == 0)
            {
                throw new Exception("删除实体失败，请检查网络");
            }
            return result;
        }
    }
}
