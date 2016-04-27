using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL.EFAnalyses
{
    public interface IAnalysisRepository
    {
        //Algorithm
        Algorithm CreateAlgorithm(Algorithm algorithm);

        //Analysis
        Analysis CreateAnalysis(Analysis analysis, User createdBy);
        Analysis ReadAnalysis(long id);
        Analysis CreateAnalysis(Analysis analysis, string email);
        IEnumerable<Analysis> ReadAnalysesForUser(User user);
        IEnumerable<Analysis> ReadAnalysesForOrganisation(Organisation organisation);


         //Cluster
        Cluster CreateCluster(Cluster cluster);
        IEnumerable<Cluster> ReadClustersForModel(Model model);

        //Feature
        Feature CreateFeature(Feature feature);

        //Model
        Model CreateModel(Model model);
        Model ReadModel(long id);
        Model ReadModel(string dataSet, AlgorithmName algorithmName);
        List<Model> ReadModelsForAlgorithm(AlgorithmName algorithmName);

        //Solvent
        Solvent CreateSolvent(Solvent solvent);

        //ClusterDistanceCenter
        ClusterDistanceCenter CreateClusterDistanceCenter(ClusterDistanceCenter clusterDistanceCenter);
        
        //AnalysisModel
        AnalysisModel CreateAnalysisModel(AnalysisModel analysisModel);
    }
}
