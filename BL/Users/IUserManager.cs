using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Users
{
    public interface IUserManager
    {
        //User
        User CreateUser(string firstname, string lastname, string email, string avatarUrl);
        User ReadUser(string email);
        User ReadUser(long id);
        User UpdateUser(User user);
        IEnumerable<User> ReadUsersForOrganisation(long id);
        void DeleteUser(User user);

        //Organisation
        Organisation CreateOrganisation(string name, string logoUrl, User user);
        Organisation ReadOrganisation(long id);
        IEnumerable<Organisation> ReadAllOrganisations();
        IEnumerable<Organisation> ReadOrganisationsForUser(User user);
        IEnumerable<Organisation> ReadOrganisationsForOrganiser(User user);

        //OrganisationMember
        OrganisationMember CreateOrganisationMember(Organisation organisation, User user);
        OrganisationMember AddMemberToOrganisation(long organisationId, string email);
        void DeleteOrganisationMember(long organisationId, long userId);
    }
}
