using c__components.Helper;
using c__components.Model;

namespace c__components.Repository
{
    public class TableRepository
    {
        DapperHelper _dapper;
        public TableRepository(DapperHelper dapper) 
        {
            this._dapper = dapper;
        }

        public async Task<IEnumerable<AkdTable>> GetTableFields(string tableName)
        {
            string sql = $@"
                SELECT 
                    t.name AS TableName,
                    c.name AS FieldName,
                    ty.name AS FieldType,
                    c.is_nullable IsRequest,
                    c.max_length MaxFieldLength,
                    ep.value AS FieldText
                FROM 
                    sys.tables t
                INNER JOIN 
                    sys.columns c ON t.object_id = c.object_id
                INNER JOIN 
                    sys.types ty ON c.system_type_id = ty.system_type_id AND c.user_type_id = ty.user_type_id
                LEFT JOIN 
                    sys.extended_properties ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.class = 1 AND ep.name = 'MS_Description'
                where t.name='{tableName}'
                ORDER BY  c.column_id;
            ";
            return await _dapper.ExecuteList<AkdTable>(sql);
        }

        public async Task<string> GetTableRemark(string tableName)
        {
            string sql = $@"
                SELECT ep.value AS TableDescription
                FROM sys.tables AS obj
                LEFT JOIN sys.extended_properties AS ep ON ep.major_id = obj.object_id
                WHERE ep.class_desc = 'OBJECT_OR_COLUMN'
                AND ep.minor_id = 0
                AND obj.name = '{tableName}';
            ";
            return await _dapper.Query<string>(sql);
        }
    }
}
