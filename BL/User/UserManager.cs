using SS.DAL.EFUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.User
{
    public class UserManager : IUserManager
    {
        private readonly IUserRepository repo;

        public UserManager()
        {
            this.repo = new UserRepository();
        }
    }
}
