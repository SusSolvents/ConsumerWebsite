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

        public AnalysisManager()
        {
            this.repo = new AnalysisRepository();
        }

        public Algorithm CreateAlgorithm(AlgorithmName algorithmName, long processTime)
        {
            Algorithm algorithm = new Algorithm()
            {
                AlgorithmName = algorithmName,
                ProcessTime = processTime,
              
            };
            return repo.CreateAlgorithm(algorithm);
        }

        public Algorithm CreateAlgorithm(Algorithm algorithm)
        {
            return repo.CreateAlgorithm(algorithm);
        }

        public Analysis CreateAnalysis(string name, DateTime dateCreated, string sourcefileUrl, User createdBy)
        {
            Analysis analysis = new Analysis()
            {
                Name = name,
                DateCreated = dateCreated,
                SourcefileUrl = sourcefileUrl,
                Analyses = new Collection<Analysis>(),
                UsedAlgorithms = new Collection<Algorithm>()
            };
            return repo.CreateAnalysis(analysis, createdBy);
        }

        public Analysis ReadAnalysis(long id)
        {
            return repo.ReadAnalysis(id);
        }

        public IEnumerable<Analysis> ReadAnalysesForUser(User user)
        {
            return repo.ReadAnalysesForUser(user);
        }

        public IEnumerable<Analysis> ReadAnalysesForOrganisation(Organisation organisation)
        {
            return repo.ReadAnalysesForOrganisation(organisation);
        }

        public Cluster CreateCluster(int number)
        {
            Cluster cluster = new Cluster()
            {
                Number = number,
                DistanceToClusters = new Collection<ClusterDistanceCenter>(),
                Solvents = new Collection<Solvent>()
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

        public Model CreateModel(string dataSet, DateTime date, string modelPath)
        {
            Model model = new Model()
            {
                DataSet = dataSet,
                Date = date,
                ModelPath = modelPath,
                Clusters = new Collection<Cluster>()
            };
            return repo.CreateModel(model);
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
    }
}
