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

        public Algorithm CreateAlgorithm(AlgorithmName algorithmName, long processTime, string generalResult)
        {
            Algorithm algorithm = new Algorithm()
            {
                AlgorithmName = algorithmName,
                ProcessTime = processTime,
                GeneralResult = generalResult,
                Clusters = new Collection<Cluster>(),
                Parameters = new Collection<Parameter>()
            };
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

        public Cluster CreateCluster(int number, double clusterCenter)
        {
            Cluster cluster = new Cluster()
            {
                Number = number,
                ClusterCenter = clusterCenter,
                Solvents = new Collection<Solvent>()
            };
            return repo.CreateCluster(cluster);
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

        public Parameter CreateParameter(string name, double value)
        {
            Parameter parameter = new Parameter()
            {
                Name = name,
                Value = value
            };
            return repo.CreateParameter(parameter);
        }

        public Solvent CreateSolvent(int number, string name, string casNr, double distanceToClusterCenter)
        {
            Solvent solvent = new Solvent()
            {
                Number = number,
                Name = name,
                CasNr = casNr,
                DistanceToClusterCenter = distanceToClusterCenter,
                Features = new Collection<Feature>()
            };
            return repo.CreateSolvent(solvent);
        }
    }
}
