using c__components.Filter;
using c__components.Helper;
using c__components.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using c__components.Repository;

namespace c__components.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [ServiceFilter(typeof(TokenAttribute))]
    public class DeleteController : ControllerBase
    {
        private DeleteRepository _delete;
        private LogRepository _log;
        private DapperHelper _dapper;
        public DeleteController(DeleteRepository delete, DapperHelper dapper)
        {
            _delete = delete;
            _dapper = dapper;
        }

        [HttpPost]
        public async Task<int> Delete(UpdateByIDAndTable model)
        {
            int result = 0;
            SqlConnection conn = null;
            IDbTransaction tran = null;
            try
            {
                using (conn = _dapper.OpenConnection())
                {
                    await conn.OpenAsync();
                    tran = conn.BeginTransaction();
                    result = await _delete.Delete(model,tran,conn);
                    tran.Commit();
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(ex.Message);
                try
                {
                    tran.Rollback();
                }
                catch
                {
                }
                throw new Exception(ex.Message);
            }
            finally
            {
                if (tran != null)
                {
                    tran.Dispose();
                }
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
            return result;
        }

        [HttpPost]
        public async Task<int> DeleteList(List<UpdateByIDAndTable> model)
        {
            int result = 0;
            SqlConnection conn = null;
            IDbTransaction tran = null;
            try
            {
                using (conn = _dapper.OpenConnection())
                {
                    await conn.OpenAsync();
                    tran = conn.BeginTransaction();
                    foreach (var item in model)
                    {
                        result += await _delete.Delete(item, tran, conn);
                    }
                    tran.Commit();
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(ex.Message);
                try
                {
                    tran.Rollback();
                }
                catch
                {
                }
                throw new Exception(ex.Message);
            }
            finally
            {
                if (tran != null)
                {
                    tran.Dispose();
                }
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
            return result;
        }
    }
}
