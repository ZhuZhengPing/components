using c__components.Helper;
using c__components.Model;

namespace c__components.Repository
{
    public class SelectRepository
    {
        DapperHelper _dapper;
        public SelectRepository(DapperHelper dapper)
        {
            _dapper = dapper;
        }
        public async Task<dynamic> Select(GetByIDAndTable model)
        {
            return await _dapper.Query<dynamic>($" select * from {model.TableName} with(nolock) where id={model.ID} ");
        }

        public async Task<IEnumerable<dynamic>> SelectList(string tableName)
        {
            GetByIDAndTableString model = new GetByIDAndTableString();
            model.TableName = tableName;
            return await SelectList(model);
        }
        public async Task<IEnumerable<dynamic>> SelectList(string tableName,string where)
        {
            GetByIDAndTableString model = new GetByIDAndTableString();
            model.TableName = tableName;
            model.Where = where;
            return await SelectList(model);
        }
        public async Task<IEnumerable<dynamic>> SelectList(GetByIDAndTableString model)
        {
            string sql = $" select * from {model.TableName} with(nolock) ";
            if (!string.IsNullOrWhiteSpace(model.Where))
            {
                sql = sql + $" where {model.Where} ";
            }
            if (!string.IsNullOrWhiteSpace(model.OrderBy))
            {
                sql = sql + $" order by {model.OrderBy} ";
            }
            return await _dapper.ExecuteList<dynamic>(sql);
        }

        public async Task<DapperPageModel<dynamic>> SelectListPages(GetPageList model)
        {
            string sql = $" select * from {model.TableName} with(nolock) ";
            string count = $" select count(*) from {model.TableName} with(nolock) ";
            string where = string.Empty;
            string order = string.Empty;
            if (!string.IsNullOrWhiteSpace(model.Where))
            {
                sql = sql + $" where {model.Where} ";
            }
            if (!string.IsNullOrWhiteSpace(model.OrderBy))
            {
                sql = sql + $" order by {model.OrderBy} ";
            }
            else
            {
                sql = sql + $" order by id desc ";
            }
            string page = $" offset {model.PageIndex * model.PageSize} rows fetch next {model.PageSize} only ";
            sql = $"{count} {where} {sql} {where} {order} {page}";
            return await _dapper.ExecutePageList<dynamic>(sql);
        }
    }
}
