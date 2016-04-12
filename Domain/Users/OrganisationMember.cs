using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Users
{
    public class OrganisationMember
    {
        [Key]
        public long Id { get; set; }
        public User User { get; set; }
        public Organisation Organisaiton { get; set; }
    }
}
