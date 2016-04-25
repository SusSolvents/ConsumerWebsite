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

        public User ReadUser(string email)
        {
            return repo.ReadUser(email);
        }

        public User ReadUser(long id)
        {
            return repo.ReadUser(id);
        }

        public User UpdateUser(User user)
        {
            return repo.UpdateUser(user);
        }

        public void DeleteUser(User user)
        {
            repo.DeleteUser(user);
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

        public Organisation ReadOrganisation(long id)
        {
            return repo.ReadOrganisation(id);
        }

        public IEnumerable<Organisation> ReadAllOrganisations()
        {
            return repo.ReadAllOrganisations();
        }

        public IEnumerable<Organisation> ReadOrganisationsForUser(User user)
        {
            return repo.ReadOrganisationsForUser(user);
        }

        public IEnumerable<Organisation> ReadOrganisationsForOrganiser(User user)
        {
            return repo.ReadOrganisationsForOrganiser(user);
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
