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
            foreach (AlgorithmName algorithm in algorithmNames)
            {
                
            }
            return Ok();
        }

        [AllowAnonymous]
        [Route("CreateModel")]
        public async Task<IHttpActionResult> CreateModel()
        {
            try
            {
                using (var client = new WebClient())
                {
                   // client.Headers.Add("Content-Type", "application/json");
                    var response = client.UploadFile(new Uri("http://api-sussolkdg.rhcloud.com/api/model/canopy"),
                        HttpContext.Current.Server.MapPath("~/Content/Csv/matrix.csv"));


                    var jsonResponse = Encoding.Default.GetString(response);
                    dynamic jsonModel = JsonConvert.DeserializeObject(jsonResponse);
                    Algorithm algorithm = new Algorithm()
                    {
                        AlgorithmName = AlgorithmName.Canopy,
                        Models = new List<Model>()
                    };
                    Model model = new Model()
                    {
                        Clusters = new List<Cluster>(),
                        DataSet = jsonModel.dataSet,
                        Date = DateTime.Now,
                        ModelPath = jsonModel.modelPath
                    };
                    foreach (var cluster in jsonModel.clusters)
                    {
                        Cluster clusterTemp = new Cluster()
                        {
                            DistanceToClusters = new List<ClusterDistanceCenter>(),
                            Number = cluster.clusterNumber,
                            Solvents = new List<Solvent>()
                        };
                        foreach (var solvent in cluster.solvents)
                        {
                            Solvent solventTemp = new Solvent()
                            {
                                CasNumber = solvent.casNumber,
                                Name = solvent.name,
                                DistanceToClusterCenter = solvent.distanceToCluster,
                                Features = new List<Feature>()
                            };

                            foreach (var feature in solvent.features)
                            {
                                Feature featureTemp = new Feature()
                                {
                                    FeatureName = feature.name,
                                    Value = feature.value
                                };
                                solventTemp.Features.Add(featureTemp);
                            }
                            clusterTemp.Solvents.Add(solventTemp);
                        }
                        model.Clusters.Add(clusterTemp);
                    }
                    algorithm.Models.Add(model);

                    client.Dispose();
                    return Json(Encoding.Default.GetString(response));
                }
            }
            catch (Exception e)
            {
                return BadRequest("An error occurred while generating the model.");
            }

        }  
    }
}
