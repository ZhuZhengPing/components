using c__components.Helper;
using c__components.Model;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;
using c__components.Repository;

namespace c__components.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UpdateController : ControllerBase
    {
        private AddRepository _add;
        private SelectRepository _select;
        private UpdateRepository _update;
        private DapperHelper _dapper;
        public UpdateController(AddRepository add,UpdateRepository update, SelectRepository select, DapperHelper dapper)
        {
            _add = add;
            _update = update;
            _select = select;
            _dapper = dapper;
        }

        [HttpPost]
        public async Task<int> Update(UpdateModel model)
        {
            int result = 0;
            SqlConnection conn = null;
            IDbTransaction tran = null;
            try
            {

                IEnumerable<dynamic> fields = await _select.SelectList(new GetByIDAndTableString()
                {
                    TableName = "AkdTable",
                    Where = $" IsInEdit=1 and TableName='{model.TableName}' "
                });

                Dictionary<string,object> values = new Dictionary<string,object>();
                foreach (var item in model.Values)
                {
                    if (fields.Any(p => p.FieldName == item.Key))
                    {
                        values.Add(item.Key, item.Value);
                    }
                }
                model.Values = values; 

                using (conn = _dapper.OpenConnection())
                {
                    await conn.OpenAsync();
                    tran = conn.BeginTransaction();
                    result = await _update.Update(model,tran,conn);
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
        public async Task<int> UpdateList(List<UpdateModel> model)
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
                        if(item.ID > 0)
                        {
                            result += await _update.Update(item,tran,conn);
                        }
                        else
                        {
                            result += await _add.Add(item, tran, conn);
                        }
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
