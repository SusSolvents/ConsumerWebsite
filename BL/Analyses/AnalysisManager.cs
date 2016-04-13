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

        public Analysis CreateAnalysis(string name, DateTime date, string sourcefileUrl, User createdBy)
        {
            Analysis analysis = new Analysis()
            {
                Name = name,
                Date = date,
                SourcefileUrl = sourcefileUrl,
                Analyses = new Collection<Analysis>(),
                UsedAlgorithms = new Collection<Algorithm>()
            };
            return repo.CreateAnalysis(analysis, createdBy);
        }

        public Cluster CreateCluster(int number, double clusterCenter)
        {
            throw new NotImplementedException();
        }

        public Feature CreateFeature(FeatureName featureName, double value)
        {
            throw new NotImplementedException();
        }

        public Parameter CreateParameter(string name, double value)
        {
            throw new NotImplementedException();
        }

        public Solvent CreateSolvent(int number, string name, string casNr, double distanceToClusterCenter)
        {
            throw new NotImplementedException();
        }
    }
}
