using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL.EFUsers
{
    public interface IUserRepository
    {
        //User
        User CreateUser(User user);
        User ReadUser(string email);
        User ReadUser(long id);
        IEnumerable<User> ReadAllUsers();
        IEnumerable<User> ReadUsersForOrganisation(Organisation organisation);
        User UpdateUser(User user);
        void DeleteUser(User user);

        //Organisation
        Organisation CreateOrganisation(Organisation organisation, User user);
        Organisation ReadOrganisation(string name);
        IEnumerable<Organisation> ReadAllOrganisations();
        IEnumerable<Organisation> ReadOrganisationsForUser(User user);
        IEnumerable<Organisation> ReadOrganisationsForOrganiser(User user);

            //OrganisationMember
        OrganisationMember CreateOrganisationMember(Organisation organisation, User user);
        IEnumerable<OrganisationMember> ReadAllMembersForOrganisation(Organisation organisation);
        IEnumerable<OrganisationMember> ReadAllOrganisationsForMember(User user);


    }
}
