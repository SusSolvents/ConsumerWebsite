using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SS.BL.Domain.Users;

namespace SS.UI.Web.MVC.Models
{
    public class AdminInformationModel
    {
        public List<User> BlockedUsers { get; set; }

    }
}