using c__components.Filter;
using c__components.Helper;
using c__components.Model;
using c__components.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace c__components.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [ServiceFilter(typeof(TokenAttribute))]
    public class ConfigController : ControllerBase
    {
        private DapperHelper _dapper;
        private ConfigRepository _config;
        public ConfigController(DapperHelper dapper, ConfigRepository config)
        {
            this._dapper = dapper;
            this._config = config;
        }

        [HttpPost]
        public async Task<dynamic> SelectConfigByID(GetByName model)
        {
            return await _config.SelectConfigByID(model);
        }
    }
}
