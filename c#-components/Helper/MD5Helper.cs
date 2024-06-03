using System.Security.Cryptography;
using System.Text;

namespace c__components.Helper
{
    public class MD5Helper
    {
        IConfiguration configuration;
        public MD5Helper(IConfiguration _configuration)
        {
            configuration = _configuration;
        }
        public string GetMD5(string source)
        {
            string result = "";
            MD5 getMD5 = new MD5CryptoServiceProvider();
            byte[] targetStr = getMD5.ComputeHash(UnicodeEncoding.UTF8.GetBytes(source));
            result = BitConverter.ToString(targetStr).Replace("-", "");
            return result.ToUpper();
        }

        public bool MD5<T>(T t, string sign)
        {
            string secretKey = configuration["SyncKeySecret"];
            string md5 = GetMD5(secretKey + t + secretKey);
            return md5 == sign;
        }   
    }
}
