namespace project.webapi.Model
{
    public class DatUser
    {
        public int ID { get; set; }
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public DateTime CreateTime {  get; set; }
    }

    public class DoLoginModel
    {
        public string UserID { get; set; }
        public string Password { get; set; }
    }

    public class DoLoginJWT
    {
        public DoLoginJWT(){}
        public DoLoginJWT(string userId,string password,long exptime)
        {
            this.UserID = userId;
            this.Password= password;
            this.ExpTime=exptime;
        }
        public string UserID { get; set; }
        public string Password { get; set; }
        public long ExpTime { get; set; }
    }
}
