﻿using System;
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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

namespace SS.UI.Web.MVC.Controllers
{
    [Authorize]
    [RoutePrefix("api/Analysis")]
    public class AnalysisController : ApiController
    {
        
        private readonly IAnalysisManager _analysisManager;
        private readonly IUserManager _userManager;
        //private readonly List<string> _datasets; 
        public AnalysisController(IAnalysisManager analysisManager, IUserManager userManager)
        {
            this._analysisManager = analysisManager;
            this._userManager = userManager;

           // _datasets.Add(Properties.Resources.datasetqframe);

        }

        //GET api/Analysis/GetAnalysis
        [Route("GetAnalysis")]
        [HttpGet]
        public IHttpActionResult GetAnalysis([FromUri]long id)
        {
            return Ok(_analysisManager.ReadAnalysis(id));
        }

        //GET api/Analysis/GetAnalysesForUser
        [Route("GetAnalysesForUser")]
        [HttpGet]
        public IHttpActionResult GetAnalysesForUser([FromUri] long id)
        {
            var user = _userManager.ReadUser(id);
            return Ok(_analysisManager.ReadAnalysesForUser(user).ToList());
        } 

        //GET api/Analysis/GetAnalysesForOrganisation
        [Route("GetAnalysesForOrganisation")]
        [HttpGet]
        public IHttpActionResult GetAnalysesForOrganisation(long id)
        {
            return Ok(_analysisManager.ReadAnalysesForOrganisation(id).ToList());
        }

        //GET api/Analysis/GetAnalysesByMonth
        [Route("GetAnalysesByMonth")]
        [HttpGet]
        public IHttpActionResult GetAnalyses()
        {
            return Ok(_analysisManager.ReadAnalyses().GroupBy(x => x.DateCreated.Month));
        }
        
        //GET api/Analysis/GetAnalysesDivision
        [Route("GetAnalysesDivision")]
        [HttpGet]
        public IHttpActionResult GetAnalysesDivision()
        {
            var analyses = _analysisManager.ReadFullAnalyses();
            return Ok(analyses.ToList());
        }

        //POST api/Analysis/ChangeName
        [Route("ChangeName")]
        [HttpPost]
        public IHttpActionResult ChangeName([FromUri] string name, [FromUri] long analysisId)
        {
            if (_analysisManager.ReadAnalysis(name) != null)
            {
                return BadRequest("Name is already in use!");
            }
            var analysis = _analysisManager.ReadAnalysis(analysisId);
            analysis.Name = name;
            _analysisManager.UpdateAnalysis(analysis);
            return Ok("Name has been changed");
        }

        //GET api/Analysis/GetSolvents
        [Route("GetSolvents")]
        [HttpGet]
        public IHttpActionResult GetSolvents(long id)
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
            return Ok(solvents);
        }

        //GET api/Analysis/GetFullModels
        [Route("GetFullModels")]
        [HttpGet]
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

        [Route("FillAlgorithms")]
        [HttpGet]
        public List<Model> FillAlgorithms()
        {
            String test = SS.UI.Web.MVC.Properties.Resources.datasetqframe.ToString();
            var pathWithEnv = @"%USERPROFILE%\";
            var filePath = Environment.ExpandEnvironmentVariables(pathWithEnv);
            com.sussol.domain.utilities.Globals.STORAGE_PATH = filePath;
            com.sussol.web.controller.ServiceModel sus = new com.sussol.web.controller.ServiceModel();

            //var perso = JsonConvert.DeserializeObject<dynamic>();
            JObject jObject = JObject.Parse(sus.canopyModeller(test, "", "").ToString());
            JToken jModel = jObject["model"];


            //JToken jClusters = jModel["clusters"];
            ////JToken jClusters = jObject["clusters"];

            ////Debug.WriteLine("model: " + (string)jModel.ToString());

            //JArray array = JArray.Parse(jClusters.ToString());
            //List<Cluster> clusters = new List<Cluster>();

            //foreach (JObject content in array.Children<JObject>())
            //{
            //    JArray DiToClu = JArray.Parse(content["distanceToClusters"].ToString());
            //    List<ClusterDistanceCenter> CluDiCeList = new List<ClusterDistanceCenter>();
            //    JArray VectorDatas = JArray.Parse(content["vectorData"].ToString());
            //    List<VectorData> VectorDataList = new List<VectorData>();
            //    JArray solvents = JArray.Parse(content["solvents"].ToString());
            //    List<Solvent> solventList = new List<Solvent>();
            //    JArray features = JArray.Parse(content["features"].ToString());
            //    List<Feature> featureList = new List<Feature>();

            //    foreach (JObject DiToClucont in array.Children<JObject>())
            //    {
            //        ClusterDistanceCenter CluDiCe = new ClusterDistanceCenter()
            //        {
            //            ToClusterId = (long)DiToClu["clusterId"],
            //            Distance = (double)DiToClu["distance"]
            //        };

            //        CluDiCeList.Add(CluDiCe);
            //    }



            //    foreach (JObject vector in VectorDatas)
            //    {
            //        VectorData vect = new VectorData()
            //        {
            //            Value = (double)vector["value"],
            //            FeatureName = (FeatureName)Enum.Parse(typeof(FeatureName), (string)vector["name"])

            //    };
            //        VectorDataList.Add(vect);
            //    }

            //    foreach(JObject feature in features)
            //    {
            //        Feature feat = new Feature()
            //        {
            //            FeatureName = (FeatureName)Enum.Parse(typeof(FeatureName), (string)feature["name"]),
            //            Value = (double)feature["value"]
            //        };
            //        featureList.Add(feat);
            //    }

            //    foreach (JObject solvent in solvents)
            //    {
            //        Solvent solv = new Solvent()
            //        {
            //            Name = (string)solvent["name"],
            //            CasNumber = (string)solvent["casNumber"],
            //            DistanceToClusterCenter = (double)solvent["distanceToClusterCenter"],
            //            Features = featureList
            //        };
            //    };

            //    Cluster clust = new Cluster()
            //    {
            //        Number = (int)content["clusterNumber"],
            //        DistanceToClusters = CluDiCeList,
            //        Solvents = solventList,
            //        VectorData = VectorDataList
            //    };
            //}



            //Model model = new Model()
            //{
            //    DataSet = (string)jModel["dataSet"],
            //    //Date = (DateTime)jModel["date"],
            //    ModelPath = (string)jModel["modelPath"],
            //    Clusters = clusters

            //};

            List<Model> mod = JsonHelper.ParseJson(jObject.ToString(), _analysisManager.ReadMinMaxValues().ToList()).Models.ToList();
            Algorithm algo = new Algorithm()
            {
                AlgorithmName = 0,
                Models = mod
            };
            _analysisManager.CreateAlgorithm(algo);
            return mod;

        }

        //POST api/Analysis/Createanalysis
        [Route("CreateAnalysis")]
        [HttpPost]
        public IHttpActionResult CreateAnalysis([FromUri] List<string> algorithms, [FromUri] string dataSet, [FromUri] string name)
        {
            if (_analysisManager.ReadAnalysis(name) != null)
            {
                return BadRequest("Name already in use!");
            }
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
            return Ok(analysis);
        }

        //GET api/Analysis/SetStringsToAlgorithmNames
        [Route("SetStringsToAlgorithmNames")]
        [HttpGet]
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

        //POST api/Analysis/StartAnalysis
        [Route("StartAnalysis")]
        [HttpPost]
        public async Task<IHttpActionResult> StartAnalysis([FromUri] List<string> algorithms )
        {
            List<AlgorithmName> algorithmNames = SetStringsToAlgorithmNames(algorithms);
            List<Model> models = new List<Model>();
            foreach (AlgorithmName algorithm in algorithmNames)
            {
                //var modelsTemp = _analysisManager.ReadModelsForAlgorithm(algorithm);
                var modelsTemp = _analysisManager.ReadModelsForAlgorithm(algorithm); ;
                if (modelsTemp.Count == 0)
                {
                    await CreateModels(algorithm);
                                
                }
                models.AddRange(_analysisManager.ReadModelsForAlgorithm(algorithm)); 
            }
            return Ok(models.GroupBy(x => x.DataSet).Select(y => y.First()).ToList());
        }

        //POST api/Analysis/CreateModel
        [AllowAnonymous]
        [Route("CreateModel")]
        [HttpPost]
        public async Task<IHttpActionResult> CreateModels(AlgorithmName algorithmName)
        {
            var minMaxValues = _analysisManager.ReadMinMaxValues();
            try
            {
                using (var client = new WebClient())
                {
                    //foreach (var dataset in _datasets)
                    //{


                    // var response = client.UploadFile(new Uri("http://localhost:8080/SussolWebservice/api/model/" + "canopy" + dataset.ToString())); //algorithmName.ToString().ToLower())
                    //creatie van model binnen algoritme
                    //var jsonResponse = Encoding.Default.GetString(response);
                    //var algorithm =  minMaxValues.ToList();
                    //_analysisManager.CreateAlgorithm(algorithm);
                    //}

                    //var response = servicedll.canopyModeller(SS.UI.Web.MVC.Properties.Resources.datasetqframe, "", "");
                    //System.Diagnostics.Debug.Write(response.toString());

                    FillAlgorithms();
                    client.Dispose();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest("An error occurred while generating the model.");
            }
        }
        
        //POST api/Analysis/ShareWithOrganisation
        [Route("ShareWithOrganisation")]
        [HttpPost]
        public IHttpActionResult ShareWithOrganisation(long organisationId, long analysisId)
        {
            var analysis = _analysisManager.ShareWithOrganisation(organisationId, analysisId);
            return Ok(analysis);
        }

        //POST api/Analysis/CheckPermission
        [Route("CheckPermission")]
        [HttpPost]
        public IHttpActionResult CheckPermission(long userId, long analysisId)
        {
            var analyses = _analysisManager.ReadAnalysesForUserPermission(userId);
            var analysis = _analysisManager.ReadAnalysis(analysisId);
            if (analysis == null)
            {
                return BadRequest("Analysis not found");
            }
            if (analyses.Contains(analysis))
            {
                return Ok();
            }
            return BadRequest("Access not granted");
        }

        //POST api/Analysis/UndoShare
        [Route("UndoShare")]
        [HttpPost]
        public IHttpActionResult UndoShare(long id)
        {
            var analysis = _analysisManager.UndoShare(id);
            return Ok(analysis);
        }


        //GET api/Analysis/ReadMinMaxValues
        [Route("ReadMinMaxValues")]
        [HttpGet]
        public IHttpActionResult ReadMinMaxValues([FromUri]long analysisId)
        {
            if (_analysisManager.ReadAnalysis(analysisId) != null)
            {
                return Ok(_analysisManager.ReadMinMaxValues(analysisId).ToList());
            }
            return BadRequest("Analysis not found");
        }

        //DELETE api/Analysis/Delete
        [Route("Delete/{id:int}")]
        [HttpPost]
        public IHttpActionResult Delete(int id)
        {
            _analysisManager.DeleteAnalysis(id);

            return Ok("Analysis deleted");
        }

        //GET api/Analysis/ReadClassifiedInstances
        [Route("ReadClassifiedInstances")]
        [HttpGet]
        public IHttpActionResult ReadClassifiedInstances(long userId, long analysisId)
        {
            return Ok(_analysisManager.ReadClassifiedInstancesForUser(userId, analysisId).ToList());
        }

        //POST api/Analysis/ClassifyNewSolvent
        [Route("ClassifyNewSolvent")]
        [HttpPost]
        public IHttpActionResult ClassifyNewSolvent([FromBody]ClassifySolventModel model, [FromUri] long analysisId)
        {
            var instances = _analysisManager.ReadClassifiedInstancesForUser(model.UserId, analysisId).ToList();
            foreach (var cluster in model.AnalysisModels[0].Model.Clusters)
            {
                if (cluster.Solvents.FirstOrDefault(a => a.CasNumber.Equals(model.CasNumber)) != null)
                {
                    return BadRequest("Cas number is already in use!");
                }
                if (cluster.Solvents.FirstOrDefault(a => a.Name.Equals(model.Name)) != null)
                {
                    return BadRequest("Name is already in use!");
                }
            }

            if (instances.FirstOrDefault(a => a.Name.Equals(model.Name)) != null)
            {
                return BadRequest("You used this name already for a classified solvent!");
            }
            if (instances.FirstOrDefault(a => a.CasNumber == model.CasNumber) != null)
            {
                return BadRequest("You used this cas nr already for a classified solvent!");
            }

            using (var client = new WebClient())
            {
                List<AnalysisModel> analysisModels = new List<AnalysisModel>();
                foreach (var analysisModel in model.AnalysisModels)
                {
                    var serialized = JsonConvert.SerializeObject(model.Values);
                    String parameters = "path="+analysisModel.Model.ModelPath+"&featureValues=" + serialized;
                    client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                    var classifiedInstance = JsonHelper.ParseJsonToClassifiedInstance(client.UploadString(new Uri("http://localhost:8080/SussolWebservice/api/classify"), parameters));
                    classifiedInstance.CasNumber = model.CasNumber;
                    classifiedInstance.Name = model.Name;
                    classifiedInstance.Features = new List<Feature>();
                    
                    for (int i = 0; i < model.FeatureNames.Length; i++)
                    {
                        model.FeatureNames[i] = model.FeatureNames[i].Replace("°", "Degrees").Replace('.', '_').Replace('/', '_');
                        Feature f = new Feature()
                        {
                            FeatureName = model.FeatureNames[i].ToString(),
                            Value = model.Values[i]
                        };
                        classifiedInstance.Features.Add(f);
                    }
                    analysisModels.Add(_analysisManager.CreateClassifiedInstance(analysisModel.Id,model.UserId, classifiedInstance));
                    
                }
                client.Dispose();
                return Ok(analysisModels);
            }
        }

        //POST api/Analysis/SetClassifiedSolvent
        [Route("SetClassifiedSolvent")]
        [HttpPost]
        public IHttpActionResult SetClassifiedSolvent(string name, long analysisId, long userId)
        {
            var analysis = _analysisManager.ReadAnalysis(analysisId);
            var classifiedInstances = _analysisManager.ReadAllClassifiedInstances(userId, name).ToList();
            foreach (var model in analysis.AnalysisModels)
            {
                var instance = classifiedInstances.FirstOrDefault(a => a.AnalysisModelId == model.Id);
                if (instance != null)
                {
                    _analysisManager.SetClassifiedSolvent(model.Id, instance.Id);
                }
                else
                {
                    ArrayList values = new ArrayList();
                    var featureNames = new ArrayList();
                    foreach (var feature in classifiedInstances.First().Features)
                    {
                        values.Add(feature.Value);
                        featureNames.Add(feature.FeatureName);
                    }
                    using (var client = new WebClient())
                    {
                        
                            var serialized = JsonConvert.SerializeObject(values);
                            String parameters = "path=" + model.Model.ModelPath + "&featureValues=" + serialized;
                            client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                            var classifiedInstance = JsonHelper.ParseJsonToClassifiedInstance(client.UploadString(new Uri("http://api-sussolkdg.rhcloud.com/api/classify"), parameters));
                            classifiedInstance.CasNumber = classifiedInstances.First().CasNumber;
                            classifiedInstance.Name = classifiedInstances.First().Name;
                            classifiedInstance.Features = new List<Feature>();

                            for (int i = 0; i < featureNames.Count; i++)
                            {
                            featureNames[i] =
                            featureNames[i].ToString().Replace("°", "Degrees").Replace('.', '_').Replace('/', '_');
                            Feature f = new Feature()
                                {
                                    FeatureName = featureNames[i].ToString(),
                                    Value = Double.Parse(values[i].ToString())
                                };
                                classifiedInstance.Features.Add(f);
                            }
                            _analysisManager.CreateClassifiedInstance(model.Id, analysis.CreatedBy.Id, classifiedInstance);
                        client.Dispose();
                    }
                }
                
            }
            return Ok(_analysisManager.ReadAnalysis(analysisId).AnalysisModels);
        } 
    }
}
