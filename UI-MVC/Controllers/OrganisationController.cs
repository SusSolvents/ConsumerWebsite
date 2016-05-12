using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using SS.BL.Analyses;
using SS.BL.Domain.Analyses;
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
        private readonly IAnalysisManager _analysisManager;

        public OrganisationController(IUserManager userManager, IAnalysisManager analysisManager)
        {
            this._userManager = userManager;
            this._analysisManager = analysisManager;
        }
        

        //GET api/Organisation/GetAllOrganisations
        [Route("GetAllOrganisations")]
        public IEnumerable<Organisation> GetAllOrganisations()
        {
            return _userManager.ReadAllOrganisations();
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

            return Ok(org.Id);
        }

       

        //GET api/Organisation/ReadOrganisations
        [Route("ReadOrganisations")]
        public List<Organisation> ReadOrganisations([FromUri] long id)
        {
            var user = _userManager.ReadUser(id);
            List<Organisation> organisations = _userManager.ReadOrganisationsForUser(user).ToList();
            return organisations;
        }

        //GET api/Organisation/ReadOrganisation
        [Route("ReadOrganisation")]
        public Organisation ReadOrganisation(long id)
        {
            return _userManager.ReadOrganisation(id);
        }

        //GET api/Organisation/GetAnalysesForOrganisation
        [Route("GetAnalysesForOrganisation")]
        public List<Analysis> GetAnalysesForOrganisation(long id)
        {
            return _analysisManager.ReadAnalysesForOrganisation(id).ToList();
        }

        //GET api/Organisation/GetUsersForOrganisation
        [Route("GetUsersForOrganisation")]
        public List<User> GetUsersForOrganisation(long id)
        {
            return _userManager.ReadUsersForOrganisation(id).ToList();
        }

        //POST api/Organisation/AddMemberToOrganisation
        [Route("AddMemberToOrganisation")]
        public async Task<IHttpActionResult> AddMemberToOrganisation(long organisationId, string email)
        {
            var membersOrganisation = _userManager.ReadUsersForOrganisation(organisationId);
            if (membersOrganisation.Count() >= 5)
            {
                return BadRequest("You can have a max of 5 members in one organisation");
            }
            var memberToAdd = _userManager.ReadUser(email);
            if (memberToAdd == null)
            {
                return BadRequest("email wasn't found!");
            }
            if (membersOrganisation.Contains(memberToAdd))
            {
                return BadRequest("Member already in organisation");
            }
            _userManager.AddMemberToOrganisation(organisationId, email);

            return Ok("Member has been added to organisation");
        }

        //POST api/Organisation/LeaveOrganisation
        [Route("LeaveOrganisation")]
        public async Task<IHttpActionResult> LeaveOrganisation(long userId, long organisationId)
        {
            _userManager.DeleteOrganisationMember(organisationId, userId);
            return Ok();
        }

        //POST api/Organisation/DeleteOrganisation
        [Route("DeleteOrganisation")]
        public async Task<IHttpActionResult> DeleteOrganisation(long id)
        {
            _userManager.DeleteOrganisation(id);
            return Ok();
        }

        //GET api/Organisation/GetAnalysesByMonthForOrganisation
        [Route("GetAnalysesByMonthForOrganisation")]
        public IEnumerable<IGrouping<int, Analysis>> GetAnalyses(long id)
        {
            return _analysisManager.ReadAnalysesForOrganisation(id).GroupBy(x => x.DateCreated.Month);
        }

        //POST api/Organisation/CheckPermission
        [Route("CheckPermission")]
        public async Task<IHttpActionResult> CheckPermission(long userId, long organisationId)
        {
            var user = _userManager.ReadUser(userId);
            var organisations = _userManager.ReadOrganisationsForUser(user);
            var organisation = _userManager.ReadOrganisation(organisationId);
            if (organisations.Contains(organisation))
            {
                return Ok();
            }
            return BadRequest("Access not granted");
        }

        //POST api/Organisation/ChangeLogo
        [Route("ChangeLogo")]
        public async Task<IHttpActionResult> ChangeLogo()
        {
            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            var id = 0;
            MultipartFileData picture = null;
            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);

                id = Int32.Parse(provider.FormData.Get("id"));
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

            Organisation organisation = _userManager.ReadOrganisation(id);

            organisation.LogoUrl = imagePath;

            _userManager.UpdateOrganisation(organisation);

            return Ok();
        }
    }


}