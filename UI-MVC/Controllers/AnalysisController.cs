using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using SS.BL.Analyses;
using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using SS.BL.Users;

namespace SS.UI.Web.MVC.Controllers
{
    [Authorize]
    [RoutePrefix("api/Analysis")]
    public class AnalysisController : ApiController
    {
        private readonly AnalysisManager _analysisManager = new AnalysisManager();
        private readonly UserManager _userManager = new UserManager();

        public AnalysisController()
        {
        }

        //GET api/Analyses/GetAnalysis
        [Route("GetAnalysis")]
        public Analysis GetAnalysis(long id)
        {
            return _analysisManager.ReadAnalysis(id);
        }

        //GET api/Analyses/GetAnalysesForUser
        [Route("GetAnalysesForUser")]
        public List<Analysis> GetAnalysesForUser(string email)
        {
            var user = _userManager.ReadUser(email);
            return _analysisManager.ReadAnalysesForUser(user).ToList();
        } 

        //GET api/Analyses/GetAnalysesForOrganisation
        [Route("GetAnalysesForOrganisation")]
        public List<Analysis> GetAnalysesForOrganisation(string organisationName)
        {
            var organisation = _userManager.ReadOrganisation(organisationName);
            return _analysisManager.ReadAnalysesForOrganisation(organisation).ToList();
        } 

        //GET api/Analyses/StartAnalysis
        [Route("StartAnalysis")]
        public async Task<IHttpActionResult> StartAnalysis(List<String> algorithms )
        {
            List<AlgorithmName> algorithmNames = new List<AlgorithmName>();
            foreach (String algorithm in algorithms)
            {
                switch (algorithm)
                {
                    case "Cobweb": algorithmNames.Add(AlgorithmName.Cobweb);
                        break;
                    case "Canopy": algorithmNames.Add(AlgorithmName.Canopy);
                        break;
                    case "KMeans": algorithmNames.Add(AlgorithmName.KMeans);
                        break;
                    case "XMeans": algorithmNames.Add(AlgorithmName.XMeans);
                        break;
                    case "EM": algorithmNames.Add(AlgorithmName.EM);
                        break;
                    case "SOM": algorithmNames.Add(AlgorithmName.SOM);
                        break;
                }
            }

            return Ok();
        }
    }
}
