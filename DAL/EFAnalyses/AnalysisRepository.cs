using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;

namespace SS.DAL.EFAnalyses
{
    public class AnalysisRepository : IAnalysisRepository
    {
        private readonly EFDbContext context;

        public AnalysisRepository()
        {
            this.context = new EFDbContext();
        }

        public Algorithm CreateAlgorithm(Algorithm algorithm)
        {
            algorithm = context.Algorithms.Add(algorithm);
            context.SaveChanges();
            return algorithm;
        }

        public Analysis CreateAnalysis(Analysis analysis, User createdBy)
        {
            analysis.CreatedBy = createdBy;
            analysis = context.Analyses.Add(analysis);
            context.SaveChanges();
            return analysis;
        }

        public Cluster CreateCluster(Cluster cluster)
        {
            cluster = context.Clusters.Add(cluster);
            context.SaveChanges();
            return cluster;
        }

        public Feature CreateFeature(Feature feature)
        {
            feature = context.Features.Add(feature);
            context.SaveChanges();
            return feature;
        }

        public Parameter CreateParameter(Parameter parameter)
        {
            parameter = context.Parameters.Add(parameter);
            context.SaveChanges();
            return parameter;
        }

        public Solvent CreateSolvent(Solvent solvent)
        {
            solvent = context.Solvents.Add(solvent);
            context.SaveChanges();
            return solvent;
        }
    }
}
