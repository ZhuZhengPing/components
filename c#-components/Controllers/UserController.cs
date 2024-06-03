using c__components.Filter;
using c__components.Helper;
using c__components.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Data;
using System.Security.Cryptography;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace c__components.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        MD5Helper _md5;
        DapperHelper _dapper;
        TokenHelper _jwt;
        IConfiguration _configuration;
        public UserController(DapperHelper dapper, MD5Helper md5, TokenHelper jwt, IConfiguration configuration)
        {
            this._dapper = dapper;
            this._md5 = md5;
            this._jwt = jwt;
            this._configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> DoLogin(DoLoginModel model)
        {
            // 取出后台用户信息
            DatUser user = await _dapper.Query<DatUser>($" select * from AkdUser where userid='{model.UserID}' ");
            if (user == null)
            {
                return Ok("".FormatResult("账户或密码错误"));
            }

            string newPassword = _md5.GetMD5(model.Password);
            if (newPassword.ToLower() != user.Password.ToLower())
            {
                return Ok("".FormatResult("密码错误"));
            } 

            DoLoginJWT j = new DoLoginJWT(user.UserID, user.Password, GetExpTime());
            return Ok(new { 
              token=_jwt.Encrypt(j),
              userId=user.UserID,
              userName=user.UserName
            }.FormatResult());
        }

        [HttpPost]
        public long GetExpTime()
        {
            double tokenExpTimeConfig = double.Parse(_configuration["EncryptHour"]);
            DateTime nowTime = DateTime.Now;
            nowTime = nowTime.AddHours(tokenExpTimeConfig);
            return nowTime.Ticks;
        }
    }
}
