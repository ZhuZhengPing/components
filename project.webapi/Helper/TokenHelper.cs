using project.webapi.Model;
using Newtonsoft.Json;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace project.webapi.Helper
{
    public class TokenHelper
    {
        IConfiguration configuration;
        public TokenHelper(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        public string Encrypt(DoLoginJWT model)
        {
            string plainText = JsonConvert.SerializeObject(model);
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(configuration["EncryptKey"]);
                aesAlg.IV = Encoding.UTF8.GetBytes(configuration["EncryptIv"]);
                aesAlg.Padding = PaddingMode.PKCS7;
                // Create an encryptor to perform the stream transform.
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        return HttpUtility.UrlEncode(Convert.ToBase64String(msEncrypt.ToArray()));
                    }
                }
            }
        }

        public DoLoginJWT Decrypt(string cipherText)
        {
            cipherText = HttpUtility.UrlDecode(cipherText);
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(configuration["EncryptKey"]);
                aesAlg.IV = Encoding.UTF8.GetBytes(configuration["EncryptIv"]);
                aesAlg.Padding = PaddingMode.PKCS7;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream( Convert.FromBase64String(cipherText)))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            return JsonConvert.DeserializeObject<DoLoginJWT>(srDecrypt.ReadToEnd());
                        }
                    }
                }
            }
        }

        public long GetExpTime()
        {
            double tokenExpTimeConfig = double.Parse(configuration["EncryptHour"]);
            DateTime nowTime = DateTime.Now;
            nowTime = nowTime.AddHours(tokenExpTimeConfig);
            return nowTime.Ticks;
        }
    }
}
