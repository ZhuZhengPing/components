using project.webapi.Helper;
using project.webapi.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace project.webapi.Filter
{
    public class TokenAttribute : IActionFilter
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly TokenHelper _jwt;
        public TokenAttribute(IHttpContextAccessor httpContextAccessor, TokenHelper jwt) 
        {
            _httpContextAccessor = httpContextAccessor;
            _jwt = jwt;
        }

        void IActionFilter.OnActionExecuted(ActionExecutedContext context)
        {
            //throw new NotImplementedException();
            if(context.Exception == null)
            {
                if (context.Result is ObjectResult objectResult)
                {
                    context.Result = new ObjectResult(objectResult.Value.FormatResult());
                }
            }
            else
            {
                context.Result = new ObjectResult(new FormatResultModel<string>(string.Empty,false, context.Exception.Message));
                context.ExceptionHandled = true; // 标记异常已处理
            }
        }

        void IActionFilter.OnActionExecuting(ActionExecutingContext context)
        {
            var actionDescriptor = context.ActionDescriptor as ControllerActionDescriptor;
            string actionName = actionDescriptor.ActionName;
            if (actionName == "DoLogin")
            {
                return;
            }
            var headers = _httpContextAccessor.HttpContext.Request.Headers;
            var token = headers["token"];
            if (string.IsNullOrEmpty(token))
            {
                context.Result = new ObjectResult("-99999".FormatResult("无效的token"));
                return;
            }

            // 解析
            DoLoginJWT user = _jwt.Decrypt(token);
            if (user == null)
            {
                context.Result = new ObjectResult("-99999".FormatResult("无效的token"));
                return;
            }
            //if (user.ExpTime < DateTime.Now.Ticks)
            //{
            //    context.Result = new ObjectResult("-88888".FormatResult("token已过期"));
            //    return;
            //}

            //var paramters = context.ActionArguments;
        }
    }
}
