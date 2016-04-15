using Microsoft.Owin;
using Owin;
using SS.UI.Web.MVC;

[assembly: OwinStartup(typeof(Startup))]

namespace SS.UI.Web.MVC
{
    /// <summary>
    /// The startup.
    /// </summary>
    public partial class Startup
    {
        /// <summary>
        /// The configuration.
        /// </summary>
        /// <param name="app">
        /// The app.
        /// </param>
        public void Configuration(IAppBuilder app)
        {
            this.ConfigureAuth(app);
        }
    }
}
