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
        IEnumerable<User> ReadUsersForOrganisation(long id);
        User UpdateUser(User user);
        void DeleteUser(User user);

        //Organisation
        Organisation CreateOrganisation(Organisation organisation, User user);
        Organisation ReadOrganisation(long id);
        IEnumerable<Organisation> ReadAllOrganisations();
        IEnumerable<Organisation> ReadOrganisationsForUser(User user);
        IEnumerable<Organisation> ReadOrganisationsForOrganiser(User user);
        Organisation UpdateOrganisation(Organisation organisation);
        void BlockOrganisation(long id);
        void AllowOrganisation(long id);

        //OrganisationMember
        OrganisationMember CreateOrganisationMember(Organisation organisation, User user);
        OrganisationMember AddMemberToOrganisation(long organisationId, string email);
        IEnumerable<OrganisationMember> ReadAllMembersForOrganisation(Organisation organisation);
        IEnumerable<OrganisationMember> ReadAllOrganisationsForMember(User user);
        void DeleteOrganisationMember(long organisationId, long userId);


    }
}
