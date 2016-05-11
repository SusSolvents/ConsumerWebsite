using SS.DAL.EFAnalyses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using System.Collections.ObjectModel;

namespace SS.BL.Analyses
{
    public class AnalysisManager : IAnalysisManager
    {
        private readonly IAnalysisRepository repo;

        public AnalysisManager(IAnalysisRepository iAnalysisRepository)
        {
            this.repo = iAnalysisRepository;
        }

        public Algorithm CreateAlgorithm(AlgorithmName algorithmName)
        {
            Algorithm algorithm = new Algorithm()
            {
                AlgorithmName = algorithmName
              
            };
            return repo.CreateAlgorithm(algorithm);
        }

        public Algorithm CreateAlgorithm(Algorithm algorithm)
        {
            return repo.CreateAlgorithm(algorithm);
        }

        public Analysis CreateAnalysis(string name, DateTime dateCreated, User createdBy)
        {
            Analysis analysis = new Analysis()
            {
                Name = name,
                DateCreated = dateCreated
            };
            return repo.CreateAnalysis(analysis, createdBy);
        }

        public Analysis ReadAnalysis(long id)
        {
            return repo.ReadAnalysis(id);
        }

        public Analysis CreateAnalysis(Analysis analysis, string email)
        { 
            return repo.CreateAnalysis(analysis, email);
        }

        public IEnumerable<Analysis> ReadAnalysesForUser(User user)
        {
            return repo.ReadAnalysesForUser(user);
        }

        public IEnumerable<Analysis> ReadAnalysesForOrganisation(long id)
        {
            return repo.ReadAnalysesForOrganisation(id);
        }

        public IEnumerable<Analysis> ReadAnalysesForUserPermission(long userId)
        {
            return repo.ReadAnalysesForUserPermission(userId);
        }

        public Analysis UpdateAnalysis(Analysis analysis)
        {
            return repo.UpdateAnalysis(analysis);
        }

        public void ShareWithOrganisation(long organisationId, long analysisId)
        {
            repo.ShareWithOrganisation(organisationId, analysisId);
        }

        public Cluster CreateCluster(int number)
        {
            Cluster cluster = new Cluster()
            {
                Number = number,
                DistanceToClusters = new Collection<ClusterDistanceCenter>(),
                Solvents = new Collection<Solvent>(),
                VectorData = new Collection<VectorData>()
            };
            return repo.CreateCluster(cluster);
        }

        public IEnumerable<Cluster> ReadClustersForModel(Model model)
        {
            return repo.ReadClustersForModel(model);
        }

        public Feature CreateFeature(FeatureName featureName, double value)
        {
            Feature feature = new Feature()
            {
                FeatureName = featureName,
                Value = value
            };
            return repo.CreateFeature(feature);
        }

        public Model CreateModel(string dataSet, DateTime date, string modelPath, AlgorithmName algorithmName)
        {
            Model model = new Model()
            {
                DataSet = dataSet,
                Date = date,
                ModelPath = modelPath,
                Clusters = new Collection<Cluster>(),
                AlgorithmName = algorithmName
            };
            return repo.CreateModel(model);
        }

        public List<Model> ReadModelsForAlgorithm(AlgorithmName algorithmName)
        {
            return repo.ReadModelsForAlgorithm(algorithmName);
        }

        public Model ReadModel(long id)
        {
            return repo.ReadModel(id);
        }

        public Model ReadModel(string dataSet, AlgorithmName algorithmName)
        {
            return repo.ReadModel(dataSet, algorithmName);
        }

        public Solvent CreateSolvent(int number, string name, string casNr, double distanceToClusterCenter)
        {
            Solvent solvent = new Solvent()
            {
                Name = name,
                CasNumber = casNr,
                DistanceToClusterCenter = distanceToClusterCenter,
                Features = new Collection<Feature>()
            };
            return repo.CreateSolvent(solvent);
        }

        public ClusterDistanceCenter CreateClusterDistanceCenter(long clusterId, double distance)
        {
            ClusterDistanceCenter clusterDistanceCenter = new ClusterDistanceCenter()
            {
                ToClusterId = clusterId,
                Distance = distance
            };
            return repo.CreateClusterDistanceCenter(clusterDistanceCenter);
        }

        public AnalysisModel CreateAnalysisModel(AnalysisModel analysisModel)
        {
            return repo.CreateAnalysisModel(analysisModel);
        }
    }
}
