using SS.DAL.EFUsers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Users;

namespace SS.BL.Users
{
    public class UserManager : IUserManager
    {
        private readonly IUserRepository repo;

        public UserManager()
        {
            this.repo = new UserRepository();
        }

        public Organisation CreateOrganisation(string name, string logoUrl, User user)
        {
            Organisation organisation = new Organisation()
            {
                Name = name,
                LogoUrl = logoUrl
            };
            return repo.CreateOrganisation(organisation, user);
        }

        public OrganisationMember CreateOrganisationMember(Organisation organisation, User user)
        {
            return repo.CreateOrganisationMember(organisation, user);
        }

        public User CreateUser(string firstname, string lastname, string email, string avatarUrl)
        {
            User user = new User()
            {
                Firstname = firstname,
                Lastname = lastname,
                Email = email,
                AvatarUrl = avatarUrl
            };
            return repo.CreateUser(user);
        }
    }
}
