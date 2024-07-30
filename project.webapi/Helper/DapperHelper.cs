using System.Data;
using System.Data.SqlClient;
using project.webapi.Model;
using Dapper;
namespace project.webapi.Helper
{
    public class DapperHelper
    {
        private readonly IConfiguration configuration;
        public DapperHelper(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public SqlConnection OpenConnection()
        {
            return new SqlConnection(this.configuration["ConnectionString"]);
        }

        public async Task<int> Execute(string sql, object param, IDbTransaction transaction, CommandType? commandType, SqlConnection conn)
        {
            return await conn.ExecuteAsync(sql, param, transaction, null, commandType);
        }
        public Task<int> Execute(string sql, object param, IDbTransaction transaction, SqlConnection conn)
        {
            return Execute(sql, param, transaction, CommandType.Text, conn);
        }
        public Task<int> Execute(string sql, IDbTransaction transaction, SqlConnection conn)
        {
            return Execute(sql, null, transaction, CommandType.Text, conn);
        }

        // 不带事务的dapper处理
        public async Task<int> Execute(string sql, object param, CommandType commandType, string connection)
        {
            using (var conn = OpenConnection())
            {
                await conn.OpenAsync();
                return await conn.ExecuteAsync(sql, param, null, null, commandType);
            }
        }
        public Task<int> Execute(string sql, object param, CommandType commandType)
        {
            return Execute(sql, param, commandType, "");
        }
        public Task<int> Execute(string sql, object param)
        {
            return Execute(sql, param, CommandType.Text, "");
        }
        public Task<int> Execute(string sql)
        {
            return Execute(sql, null, CommandType.Text, "");
        }

        // 带事务的
        public async Task<T> ExecuteScalar<T>(string sql, object param, IDbTransaction transaction, CommandType commandType, SqlConnection conn)
        {
            return await conn.ExecuteScalarAsync<T>(sql, param, transaction, null, commandType);
        }
        public Task<T> ExecuteScalar<T>(string sql, object param, IDbTransaction transaction, SqlConnection conn)
        {
            return ExecuteScalar<T>(sql, param, transaction, CommandType.Text, conn);
        }
        public Task<T> ExecuteScalar<T>(string sql, IDbTransaction transaction, SqlConnection conn)
        {
            return ExecuteScalar<T>(sql, null, transaction, CommandType.Text, conn);
        }

        // 不带事务的
        public async Task<T> ExecuteScalar<T>(string sql, object param, CommandType commandType, string connection)
        {
            using (var conn = OpenConnection())
            {
                await conn.OpenAsync();
                return await conn.ExecuteScalarAsync<T>(sql, param, null, null, commandType);
            }
        }
        public Task<T> ExecuteScalar<T>(string sql, object param, CommandType commandType)
        {
            return ExecuteScalar<T>(sql, param, commandType, "");
        }
        public Task<T> ExecuteScalar<T>(string sql, object param)
        {
            return ExecuteScalar<T>(sql, param, CommandType.Text, "");
        }
        public Task<T> ExecuteScalar<T>(string sql)
        {
            return ExecuteScalar<T>(sql, null, CommandType.Text, "");
        }


        public async Task<IEnumerable<T>> ExecuteList<T>(string sql, object param, IDbTransaction transaction, CommandType commandType, SqlConnection conn)
        {
            return await conn.QueryAsync<T>(sql, param, transaction, null, commandType);
        }
        public Task<IEnumerable<T>> ExecuteList<T>(string sql, object param, IDbTransaction transaction, SqlConnection conn)
        {
            return ExecuteList<T>(sql, param, transaction, CommandType.Text, conn);
        }
        public Task<IEnumerable<T>> ExecuteList<T>(string sql, IDbTransaction transaction, SqlConnection conn)
        {
            return ExecuteList<T>(sql, null, transaction, CommandType.Text, conn);
        }

        public async Task<IEnumerable<T>> ExecuteList<T>(string sql, object param, CommandType commandType, string connection)
        {
            using (var conn = OpenConnection())
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<T>(sql, param, null, null, commandType);
            }
        }
        public Task<IEnumerable<T>> ExecuteList<T>(string sql, object param, CommandType commandType = CommandType.Text)
        {
            return ExecuteList<T>(sql, param, commandType, "");
        }
        public Task<IEnumerable<T>> ExecuteList<T>(string sql, object param)
        {
            return ExecuteList<T>(sql, param, CommandType.Text, "");
        }
        public Task<IEnumerable<T>> ExecuteList<T>(string sql)
        {
            return ExecuteList<T>(sql, null, CommandType.Text, "");
        }




        public async Task<DapperPageModel<T>> ExecutePageList<T>(string sql, object param, IDbTransaction transaction, CommandType commandType, SqlConnection conn)
        {
            using (var multi = await conn.QueryMultipleAsync(sql, param, transaction, null, commandType))
            {
                int total = multi.Read<int>().FirstOrDefault();
                var list = multi.Read<T>();
                return new DapperPageModel<T>()
                {
                    data = list,
                    total = total
                };
            }
        }
        public Task<DapperPageModel<T>> ExecutePageList<T>(string sql, object param, IDbTransaction transaction, SqlConnection conn)
        {
            return ExecutePageList<T>(sql, param, transaction, CommandType.Text, conn);
        }
        public Task<DapperPageModel<T>> ExecutePageList<T>(string sql, IDbTransaction transaction, SqlConnection conn)
        {
            return ExecutePageList<T>(sql, null, transaction, CommandType.Text, conn);
        }

        public async Task<DapperPageModel<T>> ExecutePageList<T>(string sql, object param, CommandType commandType)
        {
            using (var conn = OpenConnection())
            {
                await conn.OpenAsync();
                using (var multi = await conn.QueryMultipleAsync(sql, param, null, null, commandType))
                {
                    int total = multi.Read<int>().FirstOrDefault();
                    var list = multi.Read<T>();
                    return new DapperPageModel<T>()
                    {
                        data = list,
                        total = total
                    };
                }
            }
        }
        public Task<DapperPageModel<T>> ExecutePageList<T>(string sql, object param)
        {
            return ExecutePageList<T>(sql, param, CommandType.Text);
        }
        public Task<DapperPageModel<T>> ExecutePageList<T>(string sql)
        {
            return ExecutePageList<T>(sql, null, CommandType.Text);
        }

        public async Task<T> Query<T>(string sql, object param, IDbTransaction transaction, CommandType commandType, SqlConnection conn)
        {
            var result = await conn.QueryAsync<T>(sql, param, transaction, null, commandType);
            return result.FirstOrDefault();
        }
        public Task<T> Query<T>(string sql, object param, IDbTransaction transaction, SqlConnection conn)
        {
            return Query<T>(sql, param, transaction, CommandType.Text, conn);
        }
        public Task<T> Query<T>(string sql, IDbTransaction transaction, SqlConnection conn)
        {
            return Query<T>(sql, null, transaction, CommandType.Text, conn);
        }


        public async Task<T> Query<T>(string sql, object param, CommandType commandType)
        {
            using (var conn = OpenConnection())
            {
                await conn.OpenAsync();
                var result = await conn.QueryAsync<T>(sql, param, commandType: commandType);
                return result.FirstOrDefault();
            }
        }
        public Task<T> Query<T>(string sql, object param)
        {
            return Query<T>(sql, param, CommandType.Text);
        }
        public Task<T> Query<T>(string sql)
        {
            return Query<T>(sql, null, CommandType.Text);
        }

    }
}
