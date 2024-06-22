using c__components.Filter;
using c__components.Helper;
using c__components.Model;
using c__components.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Transactions;

namespace c__components.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [ServiceFilter(typeof(TokenAttribute))]
    public class AddController : ControllerBase
    {
        private AddRepository _add;
        private DapperHelper _dapper;
        public AddController(AddRepository add, DapperHelper dapper)
        {
            _add = add;
            _dapper = dapper;
        }
        [HttpPost]
        public async Task<int> Add(UpdateModel model)
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
                    result = await _add.Add(model, tran, conn);
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
        public async Task<int> AddList(List<UpdateModel> model)
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
                        result += await _add.Add(item, tran, conn);
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
