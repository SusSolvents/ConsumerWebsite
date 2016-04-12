using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(sussol_consumer.Startup))]
namespace sussol_consumer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
