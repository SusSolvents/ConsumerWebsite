using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SS.BL.Domain.Users;

namespace SS.UI.Web.MVC.Models
{
    public class MostActiveModel
    {
        public User User { get; set; }
        public int NumberOfUserAnalyses { get; set; }
        public Organisation Organisation { get; set; }
        public int NumberOfOrganisationAnalyses { get; set; }
    }
}