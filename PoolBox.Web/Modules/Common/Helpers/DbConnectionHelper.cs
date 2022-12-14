using Microsoft.Extensions.Configuration;
using Serenity.Data;

namespace PoolBox.Common
{
    public static class DbConnectionHelper
    {
        public static string CONNECTION_STRING_PATH => "Data:Default:ConnectionString";
        public static string PROVIDER_NAME_PATH => "Data:Default:ProviderName";
        public static string CONNECTION_STRING;
        public static string PROVIDER_NAME;

        public static DefaultSqlConnections GetDefaultSqlConnections(IConfiguration configuration)
        {
            var connectionOptions = new ConnectionStringOptions();
            var connectionEntry = new ConnectionStringEntry
            {
                ConnectionString = configuration?[CONNECTION_STRING_PATH] ?? CONNECTION_STRING,
                ProviderName = configuration?[PROVIDER_NAME_PATH] ?? PROVIDER_NAME
            };
            connectionOptions.Add("Default", connectionEntry);

            var connectionString = new DefaultConnectionStrings(connectionOptions);

            return new DefaultSqlConnections(connectionString);
        }
    }
}
