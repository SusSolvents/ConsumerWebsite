using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using SS.BL.Analyses;
using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using SS.BL.Users;
using SS.UI.Web.MVC.Controllers.Utils;

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
        public List<Analysis> GetAnalysesForOrganisation(long id)
        {
            var organisation = _userManager.ReadOrganisation(id);
            return _analysisManager.ReadAnalysesForOrganisation(organisation).ToList();
        } 

        //GET api/Analyses/StartAnalysis
        [Route("StartAnalysis")]
        public async Task<IHttpActionResult> StartAnalysis([FromUri] List<string> algorithms )
        {
            List<AlgorithmName> algorithmNames = new List<AlgorithmName>();
            foreach (String algorithm in algorithms)
            {
                switch (algorithm)
                {
                    case "Cobweb": algorithmNames.Add(AlgorithmName.COBWEB);
                        break;
                    case "Canopy": algorithmNames.Add(AlgorithmName.CANOPY);
                        break;
                    case "KMeans": algorithmNames.Add(AlgorithmName.KMEANS);
                        break;
                    case "XMeans": algorithmNames.Add(AlgorithmName.XMEANS);
                        break;
                    case "EM": algorithmNames.Add(AlgorithmName.EM);
                        break;
                    case "SOM": algorithmNames.Add(AlgorithmName.SOM);
                        break;
                }
            }
            foreach (AlgorithmName algorithm in algorithmNames)
            {
                                
            }
            return Ok();
        }

        [AllowAnonymous]
        [Route("CreateModel")]
        public async Task<IHttpActionResult> CreateModel(AlgorithmName algorithmName)
        {
            try
            {
                using (var client = new WebClient())
                {
                    var response = client.UploadFile(new Uri("http://api-sussolkdg.rhcloud.com/api/model/" + algorithmName.ToString().ToLower()),
                        HttpContext.Current.Server.MapPath("~/Content/Csv/matrix.csv"));
                    //creatie van model binnen algoritme
                    var jsonResponse = Encoding.Default.GetString(response);
                    var algorithm = JsonHelper.ParseJson(jsonResponse);
                    _analysisManager.CreateAlgorithm(algorithm);
                    client.Dispose();
                    return Ok();
                }
            }
            catch (Exception)
            {
                return BadRequest("An error occurred while generating the model.");
            }
        }  
    }
}
