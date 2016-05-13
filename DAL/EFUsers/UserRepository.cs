using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Users;

namespace SS.DAL.EFUsers
{
    public class UserRepository : IUserRepository
    {
        private readonly EFDbContext _context;

        public UserRepository(EFDbContext efDbContext)
        {
            this._context = efDbContext;
        }

        public User JoinOrganisation(string email, long id)
        {
            var organisation = _context.Organisations.Find(id);
            var user = _context.Users.Single(a => a.Email.Equals(email));
            user.Organisation = organisation;
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
            return user;
        }

        public User UpdateUser(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
            return user;
        }

        public void DeleteUser(User user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }

        public Organisation CreateOrganisation(Organisation organisation, User user)
        {
            organisation =  _context.Organisations.Add(organisation);
            user.Organisation = organisation;
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
            return organisation;
        }

        public Organisation ReadOrganisation(long id)
        {
            return _context.Organisations.Find(id);
        }

        public Organisation UpdateOrganisation(Organisation organisation)
        {
            _context.Entry(organisation).State = EntityState.Modified;
            _context.SaveChanges();
            return organisation;
        }

        public void BlockOrganisation(long id)
        {

            var organisation = _context.Organisations.Find(id);
            organisation.Blocked = true;
            _context.SaveChanges();
        }

        public void AllowOrganisation(long id)
        {
            var organisation = _context.Organisations.Find(id);
            organisation.Blocked = false;
            _context.SaveChanges();
        }

        public User CreateUser(User user)
        {
            user.DateRegistered = DateTime.Now;
            user = _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public User ReadUser(string email)
        {
            return _context.Users.FirstOrDefault(e => e.Email.Equals(email));
        }

        public User ReadUser(long id)
        {
            return _context.Users.Find(id);
        }

        public IEnumerable<Organisation> ReadAllOrganisations()
        {
            return _context.Organisations.ToList();
        }


    

        public IEnumerable<User> ReadAllUsers()
        {
            return _context.Users;
        }


        public IEnumerable<User> ReadUsersForOrganisation(long id)
        {
            return _context.Users.Where(u => u.Organisation.Id == id);
        }

        public User LeaveOrganisation(long id)
        {
            var user = _context.Users.Find(id);
            user.Organisation = null;
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
            return user;
        }
    }
}
