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

        public User UpdateUser(User user)
        {
            _context.Entry(user).State = System.Data.Entity.EntityState.Modified;
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
            var organisator = _context.Users.Find(user.Id);
            organisation.Organisator = organisator;
            organisation =  _context.Organisations.Add(organisation);
            _context.SaveChanges();
            return organisation;
        }

        public Organisation ReadOrganisation(long id)
        {
            return _context.Organisations.Find(id);
        }

        public IEnumerable<Organisation> ReadOrganisationsForOrganiser(User user)
        {
            return _context.Organisations.Where(u => u.Organisator.Id == user.Id).ToList();
        }

        public OrganisationMember CreateOrganisationMember(Organisation organisation, User user)
        {
            OrganisationMember member = new OrganisationMember();
            member.Organisation = organisation;
            member.User = user;
            member = _context.OrganisationMembers.Add(member);
            _context.SaveChanges();
            return member;
        }

        public OrganisationMember AddMemberToOrganisation(long organisationId, string email)
        {
            var organisation = _context.Organisations.Find(organisationId);
            var user = _context.Users.FirstOrDefault(u => u.Email.Equals(email));
            if (user == null)
            {
                return null;
            }
            var member = new OrganisationMember()
            {
                Organisation = organisation,
                User = user
            };
            member = _context.OrganisationMembers.Add(member);
            _context.SaveChanges();
            return member;
        }

        public User CreateUser(User user)
        {
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

        public IEnumerable<OrganisationMember> ReadAllMembersForOrganisation(Organisation organisation)
        {
            return _context.OrganisationMembers.Where(o => o.Organisation.Id == organisation.Id);
        }

        public IEnumerable<Organisation> ReadAllOrganisations()
        {
            return _context.Organisations.ToList();
        }

        public IEnumerable<OrganisationMember> ReadAllOrganisationsForMember(User user)
        {
            return _context.OrganisationMembers.Where(u => u.User.Id == user.Id);
        }

        public void DeleteOrganisationMember(long organisationId, long userId)
        {
            List<OrganisationMember> members =
                _context.OrganisationMembers
                .Include(u => u.User)
                .Where(o => o.Organisation.Id == organisationId).ToList();
            OrganisationMember member = members.FirstOrDefault(u => u.User.Id == userId);
            _context.OrganisationMembers.Remove(member);
            _context.SaveChanges();
        }

        public IEnumerable<User> ReadAllUsers()
        {
            return _context.Users;
        }

        public IEnumerable<Organisation> ReadOrganisationsForUser(User user)
        {
            IEnumerable<OrganisationMember> organisationMembers = _context.OrganisationMembers
                .Include(p => p.Organisation)
                .Where(u => u.User.Id == user.Id);
            List<Organisation> organisations = new List<Organisation>();
            foreach (OrganisationMember org in organisationMembers)
            {
                organisations.Add(_context.Organisations.Find(org.Organisation.Id));
            }
            organisations.AddRange(ReadOrganisationsForOrganiser(user));
            return organisations.ToList();
        }

        public IEnumerable<User> ReadUsersForOrganisation(long id)
        {
            List<OrganisationMember> organisationMembers = _context.OrganisationMembers
                .Include(p => p.User)
                .Where(o => o.Organisation.Id == id).ToList();
            List<User> users = new List<User>();
            foreach (OrganisationMember org in organisationMembers)
            {
                var user = _context.Users.Find(org.User.Id);
                users.Add(user);
            }
            return users.AsEnumerable();
        }
    }
}
