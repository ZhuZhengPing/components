using c__components.Helper;
using c__components.Model;

namespace c__components.Repository
{
    public class ConfigRepository
    {
        private DapperHelper _dapper;
        public ConfigRepository(DapperHelper dapper)
        {
            _dapper = dapper;
        }
        public async Task<dynamic> SelectConfigByID(GetByName model)
        {
            string sql = $" select CodeNo id,CodeName text from AkdConfigDetail with(nolock) where CodeNo='{model.Name}' order by OrderNo ";
            return await _dapper.Query<dynamic>(sql, model);
        }
    }
}
