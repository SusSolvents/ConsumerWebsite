using System.Web.Optimization;

namespace SS.UI.Web.MVC
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"
                      
                        , "~/Scripts/site.js"
                        , "~/Scripts/timeline.js"
                        , "~/Scripts/tabs.js"
                        , "~/Scripts/jquery-easing.js"
                        , "~/Scripts/morphext.min.js"
                        ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/timeline.css",
                      "~/Content/filling-section.css",
                      "~/Content/modal.css",
                      "~/Content/tabs.css",
                      "~/Content/font-awesome.min.css",
                      "~/Content/animate.css",
                      "~/Content/site.css"));
        }
    }
}
