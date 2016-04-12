using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.User
{
    public class User
    {
        public long Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        [Index(IsUnique = true)]
        public string Email { get; set; }
        public string Password { get; set; }
        public string AvatarUrl { get; set; }
    }
}
