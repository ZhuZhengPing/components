using static c__components.Model.GetPageList;

namespace c__components.Model
{
    public class DapperPageModel<T>
    {
        public IEnumerable<T>? data { get; set; }
        public int total { get; set; }
    }
    public class GetByID
    {
        public int ID { get; set; }
    }
    public class GetByName
    {
        public string Name { get; set; }
    }
    public class GetByIDAndTable : GetByID
    {
        public string TableName { get; set; }
    }

    public class GetByIDString
    {
        public string? Where { get; set; }
    }
    public class GetByIDAndTableString : GetByIDString
    {
        public string TableName { get; set; }
        public string? OrderBy { get; set; }
        public string? HasChildren { get; set; }
    }
    public class GetPageList : GetByIDAndTableString
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }

        
        
    }
    public class UpdateByID
    {
        public int ID { get; set; }
        public string UserName { get; set; }
    }
    public class UpdateByIDAndTable : UpdateByID
    {
        public string TableName { get; set; }
    }
    public class FormatResultModel<T>
    {
        public T Data { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public FormatResultModel(T data)
        {
            Data = data;
        }
        public FormatResultModel(T data, bool isSuccess, string message)
        {
            Data = data;
            IsSuccess = isSuccess;
            Message = message;
        }
    }
}
