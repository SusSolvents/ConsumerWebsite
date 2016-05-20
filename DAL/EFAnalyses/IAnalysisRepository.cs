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
        Analysis ReadAnalysis(string name);
        Analysis CreateAnalysis(Analysis analysis, string email);
        IEnumerable<Analysis> ReadAnalysesForUser(User user);
        IEnumerable<Analysis> ReadAnalysesForOrganisation(long id);
        IEnumerable<Analysis> ReadAnalysesForUserPermission(long userId); 
        Analysis UpdateAnalysis(Analysis analysis);
        Analysis UndoShare(long id);
        Analysis ShareWithOrganisation(long organisationId, long analysisId);


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
        IEnumerable<Analysis> ReadAnalyses();
        IEnumerable<Analysis> ReadFullAnalyses();

        //MinMaxValue
        IEnumerable<MinMaxValue> ReadMinMaxValues();
        IEnumerable<MinMaxValue> ReadMinMaxValues(long id);

        //ClassifiedInstance
        IEnumerable<ClassifiedInstance> ReadAllClassifiedInstances(long userId, string name);
        IEnumerable<ClassifiedInstance> ReadClassifiedInstancesForUser(long userId, long analysisId);
        AnalysisModel CreateClassifiedInstance(long modelId, long userId, ClassifiedInstance classifiedInstance);
        AnalysisModel SetClassifiedSolvent(long modelId, long instanceId);
    }
}
