using Autofac;
using SS.BL.Analyses;
using SS.BL.Users;
using SS.DAL;
using SS.DAL.EFAnalyses;
using SS.DAL.EFUsers;

namespace SS.UI.Web.MVC
{
    public class AutofacConfig
    {
        public static void Init(ContainerBuilder builder)
        {
            builder.RegisterType<AnalysisManager>().As<IAnalysisManager>().InstancePerRequest();
            builder.RegisterType<UserManager>().As<IUserManager>().InstancePerRequest();
            builder.RegisterType<AnalysisRepository>().As<IAnalysisRepository>().InstancePerRequest();
            builder.RegisterType<UserRepository>().As<IUserRepository>().InstancePerRequest();
            builder.RegisterType<EFDbContext>().InstancePerRequest();
        }
    }
}