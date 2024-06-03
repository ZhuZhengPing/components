namespace c__components.Model
{
    public class AkdLogMain
    {
        public int ID {  get; set; }
        public string TableName { get; set; }
        public int LogType {  get; set; }
        public string Remark { get; set; }
        public DateTime CreateTime { get; set; }
        public string CreateUserName { get; set; }
        public List<AkdLogDetail> Details { get; set; }=new List<AkdLogDetail>();
    }
    public class AkdLogDetail
    {
        public int ID { get; set; }
        public int AkdLogMainID { get; set; }
        public string FiledName { get; set; } = string.Empty;
        public string FileText { get; set; } = string.Empty;
        public string OldValue { get; set; } = string.Empty;
        public string NewValue { get; set; } = string.Empty;
    }
    public class AkdLogRollBack
    {
        public int ID { get; set; }
        public int AkdLogMainID { get; set; }
        public string RollBackSql { get; set; }
        public bool IsRollBack { get; set; }
    }
}
