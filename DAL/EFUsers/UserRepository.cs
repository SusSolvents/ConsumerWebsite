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

        public Organisation CreateOrganisation(Organisation organisation, User user)
        {
            organisation.Organisator = user;
            organisation =  context.Organisations.Add(organisation);
            context.SaveChanges();
            return organisation;
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
    }
}
