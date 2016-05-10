using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
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
            _csvLocations = new List<string>();
            _csvLocations.Add("~/Content/Csv/Solvent matrix_6 solvents 6 features.csv");
            _csvLocations.Add("~/Content/Csv/Solvent matrix_9 solvents 6 features.csv");
            _csvLocations.Add("~/Content/Csv/Solvent matrix_12 solvents 6 features.csv");
            _csvLocations.Add("~/Content/Csv/Solvent matrix_15 solvents 6 features.csv");
            _csvLocations.Add("~/Content/Csv/Solvent matrix_27 solvents 13 features.csv");
            _csvLocations.Add("~/Content/Csv/Solvent matrix_80 solvents 6 features.csv");


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
            var organisation = _userManager.ReadOrganisation(id);
            return _analysisManager.ReadAnalysesForOrganisation(organisation).ToList();
        } 

        //POST api/Analysis/ChangeName
        [Route("ChangeName")]
        public async Task<IHttpActionResult> ChangeName([FromUri] string name, [FromUri] long analysisId)
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
            
            try
            {
                using (var client = new WebClient())
                {
                    foreach (var csvLocation in _csvLocations)
                    {
                        var response = client.UploadFile(new Uri("http://api-sussolkdg.rhcloud.com/api/model/" + algorithmName.ToString().ToLower()),
                        HttpContext.Current.Server.MapPath(csvLocation));
                        //creatie van model binnen algoritme
                        var jsonResponse = Encoding.Default.GetString(response);
                        var algorithm = JsonHelper.ParseJson(jsonResponse);
                        _analysisManager.CreateAlgorithm(algorithm);
                    }
                    client.Dispose();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest("An error occurred while generating the model.");
            }
        }  
    }
}
