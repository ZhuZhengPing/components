namespace c__components.Model
{
    public class AkdTable
    {
        public int ID { get; set; }
        public string FiledName { get; set; }
        public string FiledText { get; set; }
        /// <summary>
        /// 类型：string，date，datetime,year,month，select,number
        /// </summary>
        public string FiledType { get; set; }
        /// <summary>
        /// 是否显示在搜索中
        /// </summary>
        public int IsInSearch { get; set; }
        public string SearchValue { get; set; }

        /// <summary>
        /// 是否在列表中
        /// </summary>
        public bool IsInTable { get; set; }
        /// <summary>
        /// 宽度，用语显示在表格中
        /// </summary>
        public int InTableWidth { get; set; }

        /// <summary>
        /// 是否在编辑项中
        /// </summary>
        public bool IsInEdit { get; set; }

        /// <summary>
        /// 是否可以为null
        /// </summary>
        public bool IsRequest { get; set; }
        public string RequestPrompt { get; set; }

        //public string FormatArray { get; set; }
        //public string FormatCodeNo { get; set; }
        public string TableFormatFunction { get; set; }
        public string SelectDataFunction { get; set; }

        public int OrderNum { get; set; }
        public string TableName { get; set; }
        public DateTime CreateTime { get; set; }
        public string CreateUserName { get; set; }
    }

    public class AkdTableButton
    {
        public int ID { get; set; }
        public string TableName { get; set; }
        /// <summary>
        /// 10:表格按钮，20：表格外按钮（添加）
        /// </summary>
        public int ButtonType { get; set; }
        public string ButtonText { get; set; }
        /// <summary>
        /// 按钮显示的状态，用数组分割[]，默认空数组
        /// </summary>
        public int ButtonVisibleStatus { get; set; }
        public int OrderNum { get; set; }
        public string ButtonFunction { get; set; }
        public DateTime CreateTime { get; set; }
        public string CreateUserName { get; set; }
    }
}
