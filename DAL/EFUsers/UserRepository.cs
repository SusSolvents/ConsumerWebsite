using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Users;

namespace SS.DAL.EFUsers
{
    public class UserRepository : IUserRepository
    {
        private readonly EFDbContext context;

        public UserRepository()
        {
            this.context = new EFDbContext();
        }

        public User UpdateUser(User user)
        {
            context.Entry(user).State = System.Data.Entity.EntityState.Modified;
            context.SaveChanges();
            return user;
        }

        public void DeleteUser(User user)
        {
            context.Users.Remove(user);
            context.SaveChanges();
        }

        public Organisation CreateOrganisation(Organisation organisation, User user)
        {
            var organisator = context.Users.Find(user.Id);
            organisation.Organisator = organisator;
            organisation =  context.Organisations.Add(organisation);
            context.SaveChanges();
            return organisation;
        }

        public Organisation ReadOrganisation(long id)
        {
            return context.Organisations.Find(id);
        }

        public IEnumerable<Organisation> ReadOrganisationsForOrganiser(User user)
        {
            return context.Organisations.Where(u => u.Organisator.Id == user.Id).ToList();
        }

        public OrganisationMember CreateOrganisationMember(Organisation organisation, User user)
        {
            OrganisationMember member = new OrganisationMember();
            member.Organisaiton = organisation;
            member.User = user;
            member = context.OrganisationMembers.Add(member);
            context.SaveChanges();
            return member;
        }

        public User CreateUser(User user)
        {
            user = context.Users.Add(user);
            context.SaveChanges();
            return user;
        }

        public User ReadUser(string email)
        {
            return context.Users.FirstOrDefault(e => e.Email.Equals(email));
        }

        public User ReadUser(long id)
        {
            return context.Users.Find(id);
        }

        public IEnumerable<OrganisationMember> ReadAllMembersForOrganisation(Organisation organisation)
        {
            return context.OrganisationMembers.Where(o => o.Organisaiton.Id == organisation.Id).ToList();
        }

        public IEnumerable<Organisation> ReadAllOrganisations()
        {
            return context.Organisations.ToList();
        }

        public IEnumerable<OrganisationMember> ReadAllOrganisationsForMember(User user)
        {
            return context.OrganisationMembers.Where(u => u.User.Id == user.Id).ToList();
        }

        public IEnumerable<User> ReadAllUsers()
        {
            return context.Users;
        }

        public IEnumerable<Organisation> ReadOrganisationsForUser(User user)
        {
            IEnumerable<OrganisationMember> organisationMembers = ReadAllOrganisationsForMember(user);
            List<Organisation> organisations = new List<Organisation>();
            foreach (OrganisationMember org in organisationMembers)
            {
                organisations.AddRange(context.Organisations.Where(o => o.Id == org.Organisaiton.Id));
            }
            organisations.AddRange(ReadOrganisationsForOrganiser(user));
            return organisations.ToList();
        }

        public IEnumerable<User> ReadUsersForOrganisation(Organisation organisation)
        {
            IEnumerable<OrganisationMember> organisationMembers = ReadAllMembersForOrganisation(organisation);
            List<User> users = new List<User>();
            foreach (OrganisationMember org in organisationMembers)
            {
                users.AddRange(context.Users.Where(u => u.Id == org.User.Id));
            }
            return users.ToList();
        }
    }
}
