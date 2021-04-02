using Serenity.ComponentModel;
using System;

namespace PoolBox.Administration.Forms
{
    [FormScript("Administration.Role")]
    [BasedOnRow(typeof(Entities.RoleRow), CheckNames = true)]
    public class RoleForm
    {
        public String RoleName { get; set; }
    }
}