using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL.EFUser
{
    public class UserRepository : IUserRepository
    {
        private readonly EFDbContext context;

        public UserRepository()
        {
            this.context = new EFDbContext();
        }
    }
}
