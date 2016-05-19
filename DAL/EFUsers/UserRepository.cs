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
            _context.SaveChanges();
            var organisationTemp = _context.Organisations.Find(organisation.Id);
            user.Organisation = organisationTemp;
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
            organisation.DateCreated = DateTime.MaxValue;
            _context.SaveChanges();
        }

        public void AllowOrganisation(long id)
        {
            var organisation = _context.Organisations.Find(id);
            organisation.Blocked = false;
            organisation.DateCreated = DateTime.Now;
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
            return _context.Users.Include(o => o.Organisation).FirstOrDefault(e => e.Email.Equals(email));
        }

        public User ReadUser(long id)
        {
            return _context.Users.Include(o => o.Organisation).FirstOrDefault(a => a.Id == id);
        }

        public IEnumerable<Organisation> ReadAllOrganisations()
        {
            return _context.Organisations.ToList();
        }


    

        public IEnumerable<User> ReadAllUsers()
        {
            return _context.Users.Include(o => o.Organisation);
        }


        public IEnumerable<User> ReadUsersForOrganisation(long id)
        {
            return _context.Users.Where(u => u.Organisation.Id == id);
        }

        public User ReadOrganiser(long id)
        {
            var userId = _context.Organisations.Find(id).OrganisatorId;
            return _context.Users.Find(userId);
        }

        public User LeaveOrganisation(long id)
        {
            var user = _context.Users
                .Include(o => o.Organisation)
                .Single(u => u.Id == id);
            user.Organisation = null;
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
            return user;
        }
    }
}
