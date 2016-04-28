using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Analyses
{
    public interface IAnalysisManager
    {
        //Algorithm
        Algorithm CreateAlgorithm(AlgorithmName algorithmName);
        Algorithm CreateAlgorithm(Algorithm algorithm);

        //Analysis
        Analysis CreateAnalysis(string name, DateTime dateCreated, User createdBy);
        Analysis ReadAnalysis(long id);
        Analysis CreateAnalysis(Analysis analysis, string email);
        IEnumerable<Analysis> ReadAnalysesForUser(User user);
        IEnumerable<Analysis> ReadAnalysesForOrganisation(Organisation organisation);
        Analysis UpdateAnalysis(Analysis analysis);

        //Cluster
        Cluster CreateCluster(int number);
        IEnumerable<Cluster> ReadClustersForModel(Model model);

        //Feature
        Feature CreateFeature(FeatureName featureName, double value);

        //Model
        Model CreateModel(string dataSet, DateTime date, string modelPath, AlgorithmName algorithmName);
        List<Model> ReadModelsForAlgorithm(AlgorithmName algorithmName);
        Model ReadModel(long id);
        Model ReadModel(string dataSet, AlgorithmName algorithmName);

        //Solvent
        Solvent CreateSolvent(int number, string name, string casNr, double distanceToClusterCenter);

        //ClusterDistanceCenter
        ClusterDistanceCenter CreateClusterDistanceCenter(long clusterId, double distance);

        //AnalysisModel
        AnalysisModel CreateAnalysisModel(AnalysisModel analysisModel);
    }
}
