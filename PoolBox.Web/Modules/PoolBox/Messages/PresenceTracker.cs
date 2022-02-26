using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PoolBox.Hubs
{
    public static class PresenceTracker
    {
        private readonly static Dictionary<string, string> ActiveConnections = new Dictionary<string, string>();

        public static void AddConnection(string userName, string connectionId)
        {
            ActiveConnections.TryAdd(userName, connectionId);
        }

        public static void RemoveConnection(string userName)
        {
            ActiveConnections.Remove(userName);
        }
    }
}
