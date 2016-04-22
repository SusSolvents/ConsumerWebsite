using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.UI.WebControls.WebParts;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using SS.BL.Domain.Users;
using SS.BL.Users;
using SS.UI.Web.MVC.Controllers.Utils;
using SS.UI.Web.MVC.Models;
using SS.UI.Web.MVC.Providers;
using UI_MVC;
using UI_MVC.Results;

namespace SS.UI.Web.MVC.Controllers
{
    [Authorize]
    [RoutePrefix("api/Organisation")]
    public class OrganisationController : ApiController
    {
        private UserManager userMgr = new UserManager();

        public OrganisationController()
        {
        }
        
        //GET api/Organisation/CreateOrganisation
        [Route("CreateOrganisation")]
        public async Task<IHttpActionResult> CreateOrganisation()
        {
            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            var name = "";
            var email = "";
            MultipartFileData picture = null;
            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);
                name = provider.FormData.Get("name");
                email = provider.FormData.Get("email");
                if (provider.FileData.Count != 0)
                {
                    picture = provider.FileData[0];
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            string imagePath = null;
            if (picture != null && picture.LocalFileName.Length > 0)
            {
                imagePath = FileHelper.GetImagePathFromRequest(picture, "OrganisationsImgPath");
            }
                

            User user = userMgr.ReadUser(email);

            Organisation org = userMgr.CreateOrganisation(name, imagePath, user);

            return Ok();
        }

        //GET api/Organisation/ReadOrganisations
        [Route("ReadOrganisations")]
        public IEnumerable<Organisation> ReadOrganisations(string email)
        {
            var user = userMgr.ReadUser(email);
            IEnumerable<Organisation> organisations = userMgr.ReadOrganisationsForUser(user);
            return organisations;
        }

        //GET api/Organisation/ReadOrganisation
        [Route("ReadOrganisation")]
        public Organisation ReadOrganisation(string name)
        {
            return userMgr.ReadOrganisation(name);
        }
    }


}