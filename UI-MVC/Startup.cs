using Microsoft.Owin;
using Owin;
using SS.UI.Web.MVC;

[assembly: OwinStartup(typeof(Startup))]

namespace SS.UI.Web.MVC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
