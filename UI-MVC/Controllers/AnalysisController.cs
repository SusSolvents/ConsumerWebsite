using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Remoting.Channels;
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
using SS.UI.Web.MVC.Models;

namespace SS.UI.Web.MVC.Controllers
{
    [Authorize]
    [RoutePrefix("api/Analysis")]
    public class AnalysisController : ApiController
    {
        private readonly IAnalysisManager _analysisManager;
        private readonly IUserManager _userManager;
        private readonly List<String> _csvLocations; 
        public AnalysisController(IAnalysisManager analysisManager, IUserManager userManager)
        {
            this._analysisManager = analysisManager;
            this._userManager = userManager;

            _csvLocations = Directory.EnumerateFiles(HttpContext.Current.Server.MapPath("~/Content/Csv/")).ToList();

        }

        //GET api/Analysis/GetAnalysis
        [Route("GetAnalysis")]
        public Analysis GetAnalysis([FromUri]long id)
        {
            return _analysisManager.ReadAnalysis(id);
        }

        //GET api/Analysis/GetAnalysesForUser
        [Route("GetAnalysesForUser")]
        public List<Analysis> GetAnalysesForUser([FromUri] long id)
        {
            var user = _userManager.ReadUser(id);
            return _analysisManager.ReadAnalysesForUser(user).ToList();
        } 

        //GET api/Analysis/GetAnalysesForOrganisation
        [Route("GetAnalysesForOrganisation")]
        public List<Analysis> GetAnalysesForOrganisation(long id)
        {
            return _analysisManager.ReadAnalysesForOrganisation(id).ToList();
        }

        //GET api/Analysis/GetAnalysesByMonth
        [Route("GetAnalysesByMonth")]
        public IEnumerable<IGrouping<int, Analysis>> GetAnalyses()
        {
            return _analysisManager.ReadAnalyses().GroupBy(x => x.DateCreated.Month);
        }
        
        //GET api/Analysis/GetAnalysesDivision
        [Route("GetAnalysesDivision")]
        public List<Analysis> GetAnalysesDivision()
        {
            var analyses = _analysisManager.ReadFullAnalyses();
            return analyses.ToList();
        }

        //POST api/Analysis/ChangeName
        [Route("ChangeName")]
        public IHttpActionResult ChangeName([FromUri] string name, [FromUri] long analysisId)
        {
            var analysis = _analysisManager.ReadAnalysis(analysisId);
            analysis.Name = name;
            _analysisManager.UpdateAnalysis(analysis);
            return Ok("Name has been changed");
        }

        //GET api/Analysis/GetSolvents
        [Route("GetSolvents")]
        public List<Solvent> GetSolvents(long id)
        {
            List<Solvent> solvents = new List<Solvent>();
            var analysis = _analysisManager.ReadAnalysis(id);
            foreach (var cluster in analysis.AnalysisModels[0].Model.Clusters)
            {
                foreach (var solvent in cluster.Solvents)
                {
                    solvents.Add(solvent);
                }
            }
            return solvents;
        }

        //GET api/Analysis/GetFullModels
        [Route("GetFullModels")]
        public List<Model> GetFullModels(List<string> algorithms, string dataSet)
        {
            List<AlgorithmName> algorithmNames = SetStringsToAlgorithmNames(algorithms);
            List<Model> models = new List<Model>();
            foreach (AlgorithmName name in algorithmNames)
            {
                models.Add(_analysisManager.ReadModel(dataSet, name));
            }
            return models;
        }

        //POST api/Analysis/Createanalysis
        [Route("CreateAnalysis")]
        public Analysis CreateAnalysis([FromUri] List<string> algorithms, [FromUri] string dataSet, [FromUri] string name)
        {
            List<Model> models = GetFullModels(algorithms, dataSet);
            Analysis analysis = new Analysis()
            {
                Name = name,
                DateCreated = DateTime.Now,
                AnalysisModels = new List<AnalysisModel>(),
                NumberOfSolvents = models[0].NumberOfSolvents
            };
            foreach (Model m in models)
            {
                AnalysisModel analysisModel = new AnalysisModel()
                {
                   Model = m
                };
                analysis.AnalysisModels.Add(analysisModel);
                
            }
            analysis = _analysisManager.CreateAnalysis(analysis, User.Identity.Name);
            return analysis;
        }

        //GET api/Analysis/SetStringsToAlgorithmNames
        [Route("SetStringsToAlgorithmNames")]
        public List<AlgorithmName> SetStringsToAlgorithmNames(List<string> algorithms)
        {
            List<AlgorithmName> algorithmNames = new List<AlgorithmName>();
            foreach (String algorithm in algorithms)
            {
                switch (algorithm.ToUpper())
                {
                    case "CANOPY":
                        algorithmNames.Add(AlgorithmName.CANOPY);
                        break;
                    case "KMEANS":
                        algorithmNames.Add(AlgorithmName.KMEANS);
                        break;
                    case "XMEANS":
                        algorithmNames.Add(AlgorithmName.XMEANS);
                        break;
                    case "EM":
                        algorithmNames.Add(AlgorithmName.EM);
                        break;
                    case "SOM":
                        algorithmNames.Add(AlgorithmName.SOM);
                        break;
                }
            }
            return algorithmNames;
        }

        //GET api/Analysis/StartAnalysis
        [Route("StartAnalysis")]
        public async Task<List<Model>> StartAnalysis([FromUri] List<string> algorithms )
        {
            List<AlgorithmName> algorithmNames = SetStringsToAlgorithmNames(algorithms);
            List<Model> models = new List<Model>();
            foreach (AlgorithmName algorithm in algorithmNames)
            {
                var modelsTemp = _analysisManager.ReadModelsForAlgorithm(algorithm);
                if (modelsTemp.Count == 0)
                {
                    await CreateModels(algorithm);
                                
                }
                models.AddRange(_analysisManager.ReadModelsForAlgorithm(algorithm)); 
            }
            return models.GroupBy(x => x.DataSet).Select(y => y.First()).ToList();
        }

        //POST api/Analysis/CreateModel
        [AllowAnonymous]
        [Route("CreateModel")]
        public async Task<IHttpActionResult> CreateModels(AlgorithmName algorithmName)
        {
            var minMaxValues = _analysisManager.ReadMinMaxValues();
            try
            {
                using (var client = new WebClient())
                {
                    foreach (var csvLocation in _csvLocations)
                    {
                        var response = client.UploadFile(new Uri("http://api-sussolkdg.rhcloud.com/api/model/" + algorithmName.ToString().ToLower()),
                        csvLocation);
                        //creatie van model binnen algoritme
                        var jsonResponse = Encoding.Default.GetString(response);
                        var algorithm = JsonHelper.ParseJson(jsonResponse, minMaxValues.ToList());
                        _analysisManager.CreateAlgorithm(algorithm);
                    }
                    client.Dispose();
                    return Ok();
                }
            }
            catch (Exception)
            {
                return BadRequest("An error occurred while generating the model.");
            }
        }
        
        //POST api/Analysis/ShareWithOrganisation
        [Route("ShareWithOrganisation")]
        public IHttpActionResult ShareWithOrganisation(long organisationId, long analysisId)
        {
            _analysisManager.ShareWithOrganisation(organisationId, analysisId);
            return Ok("Analysis shared with organisation");
        }

        //POST api/Analysis/CheckPermission
        [Route("CheckPermission")]
        public IHttpActionResult CheckPermission(long userId, long analysisId)
        {
            var analyses = _analysisManager.ReadAnalysesForUserPermission(userId);
            var analysis = _analysisManager.ReadAnalysis(analysisId);
            if (analyses.Contains(analysis))
            {
                return Ok();
            }
            return BadRequest("Access not granted");
        }


        //GET api/Analysis/ReadMinMaxValues
        [Route("ReadMinMaxValues")]
        public List<MinMaxValue> ReadMinMaxValues(long analysisId)
        {
            return _analysisManager.ReadMinMaxValues(analysisId).ToList();
        }

        //POST api/Analysis/ClassifyNewSolvent
        [Route("ClassifyNewSolvent")]
        public IHttpActionResult ClassifyNewSolvent([FromBody]ClassifySolventModel model)
        {
            using (var client = new WebClient())
            {
                foreach (var analysisModel in model.AnalysisModels)
                {
                    var serialized = JsonConvert.SerializeObject(model.Values);
                    String parameters = "path="+analysisModel.Model.ModelPath+"&featureValues=" + serialized;
                    client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                    var classifiedInstance = JsonHelper.ParseJsonToClassifiedInstance(client.UploadString(new Uri("http://api-sussolkdg.rhcloud.com/api/classify"), parameters));
                    classifiedInstance.CasNumber = model.CasNumber;
                    classifiedInstance.Name = model.Name;
                    classifiedInstance.Features = new List<Feature>();
                    
                    for (int i = 0; i < model.FeatureNames.Length; i++)
                    {
                        Feature f = new Feature()
                        {
                            FeatureName = (FeatureName)Enum.Parse(typeof(FeatureName), model.FeatureNames[i]),
                            Value = model.Values[i]
                        };
                        classifiedInstance.Features.Add(f);
                    }
                    _analysisManager.CreateClassifiedInstance(analysisModel.Id,model.UserId, classifiedInstance);
                }
                client.Dispose();
                return Ok();
            }
        }
    }
}
