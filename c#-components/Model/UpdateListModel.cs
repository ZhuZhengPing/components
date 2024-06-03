namespace c__components.Model
{
    public class UpdateModel 
    {
        public int ID { get; set; }
        public string TableName { get; set; }
        public Dictionary<string, object> Values { get; set; }
    }

    public class UpdateSimpleValue
    {
        public string OldValue { get; set; }
        public string NewValue { get; set; }
    }
}
