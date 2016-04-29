using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using SS.BL.Domain.Users;
using SS.BL.Users;
using SS.UI.Web.MVC.Controllers.Utils;


namespace SS.UI.Web.MVC.Controllers
{
    [Authorize]
    [RoutePrefix("api/Organisation")]
    public class OrganisationController : ApiController
    {
        private readonly IUserManager _userManager;

        public OrganisationController(IUserManager userManager)
        {
            this._userManager = userManager;
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
                

            User user = _userManager.ReadUser(email);

            Organisation org = _userManager.CreateOrganisation(name, imagePath, user);

            return Ok();
        }

        //GET api/Organisation/ReadOrganisations
        [Route("ReadOrganisations")]
        public List<Organisation> ReadOrganisations([FromUri] string email)
        {
            var user = _userManager.ReadUser(email);
            List<Organisation> organisations = _userManager.ReadOrganisationsForUser(user).ToList();
            return organisations;
        }

        //GET api/Organisation/ReadOrganisation
        [Route("ReadOrganisation")]
        public Organisation ReadOrganisation(long id)
        {
            return _userManager.ReadOrganisation(id);
        }
    }


}