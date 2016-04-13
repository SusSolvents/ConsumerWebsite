using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL.EFUsers
{
    public interface IUserRepository
    {
        //User
        User CreateUser(User user);

        //Organisation
        Organisation CreateOrganisation(Organisation organisation, User user);

        //OrganisationMember
        OrganisationMember CreateOrganisationMember(Organisation organisation, User user);
    }
}
