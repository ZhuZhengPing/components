namespace project.webapi.Helper
{
    public class LogHelper
    {
        private static readonly object obj = new object();
        public static void WriteLog(string message)
        {
            lock (obj)
            {
                string path = AppContext.BaseDirectory + "/Log/";
                if (!System.IO.Directory.Exists(path))
                {
                    System.IO.Directory.CreateDirectory(path);
                }
                DateTime time = DateTime.Now;
                string fileFullPath = path + time.ToString("yyyy-MM-dd") + ".System.txt";
                System.IO.StreamWriter sw;
                if (!File.Exists(fileFullPath))
                {
                    sw = File.CreateText(fileFullPath);
                }
                else
                {
                    sw = File.AppendText(fileFullPath);
                }
                using (sw)
                {
                    sw.WriteLine(message);
                    sw.Close();
                }
            }
        }
    }
}
