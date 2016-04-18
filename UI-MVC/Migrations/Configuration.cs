using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using SS.BL.Users;
using SS.UI.Web.MVC.Models;

namespace SS.UI.Web.MVC.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SS.UI.Web.MVC.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SS.UI.Web.MVC.Models.ApplicationDbContext context)
        {
            AddUserAndRole(context);
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }

        bool AddUserAndRole(ApplicationDbContext context)
        {
            IdentityResult ir;
            IdentityResult ir1;
            var rm = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            ir = rm.Create(new IdentityRole("SuperAdministrator"));
            ir1 = rm.Create(new IdentityRole("User"));
            var um = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            var user = new ApplicationUser()
            {
                UserName = "sussolvents@admin.com"
            };
            var user1 = new ApplicationUser()
            {
                UserName = "sussolvents@user.com"
            };
            ir = um.Create(user, "sussolvents");
            ir = um.Create(user1, "sussolvents");

            if (ir.Succeeded == false)
                return ir.Succeeded;
            ir = um.AddToRole(user.Id, "SuperAdministrator");
            if (ir1.Succeeded == false)
                return ir1.Succeeded;
            ir1 = um.AddToRole(user1.Id, "User");
            var userManager = new UserManager();
            userManager.CreateUser("sussolvents@admin.com", "admin", "admin", "");
            return ir.Succeeded;
        }
    }
}
