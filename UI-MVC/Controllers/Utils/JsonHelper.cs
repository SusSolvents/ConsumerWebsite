using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using SS.BL.Domain.Analyses;

namespace SS.UI.Web.MVC.Controllers.Utils
{
    public class JsonHelper
    {
        public static Algorithm ParseJson(String jsonString)
        {

            dynamic jsonModel = JsonConvert.DeserializeObject(jsonString);
            Algorithm algorithm = new Algorithm()
            {
                AlgorithmName = jsonModel.algorithm,
                Models = new List<Model>()
            };
            Model model = new Model()
            {
                Clusters = new List<Cluster>(),
                DataSet = jsonModel.dataSet,
                Date = DateTime.Now,
                ModelPath = jsonModel.modelPath,
                AlgorithmName = jsonModel.algorithm
            };
            foreach (var cluster in jsonModel.clusters)
            {
                Cluster clusterTemp = new Cluster()
                {
                    DistanceToClusters = new List<ClusterDistanceCenter>(),
                    Number = cluster.clusterNumber,
                    Solvents = new List<Solvent>()
                };

                foreach (var distance in cluster.distanceToCluster)
                {
                    ClusterDistanceCenter clusterDistanceCenter = new ClusterDistanceCenter()
                    {
                        ToClusterId = distance.clusterId,
                        Distance = distance.distance
                    };
                    clusterTemp.DistanceToClusters.Add(clusterDistanceCenter);
                }

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
            return algorithm;
        }
    }
}