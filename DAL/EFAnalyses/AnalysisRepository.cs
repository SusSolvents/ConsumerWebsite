using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
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

        public Analysis ReadAnalysis(long id)
        {
            return context.Analyses.Find(id);
        }

        public IEnumerable<Analysis> ReadAnalysesForUser(User user)
        {
            return context.Analyses.Where(u => u.CreatedBy.Id == user.Id).ToList();
        }

        public IEnumerable<Analysis> ReadAnalysesForOrganisation(Organisation organisation)
        {
            return context.Analyses.Where(o => o.SharedWith.Id == organisation.Id).ToList();
        }

        public Cluster CreateCluster(Cluster cluster)
        {
            cluster = context.Clusters.Add(cluster);
            context.SaveChanges();
            return cluster;
        }

        public IEnumerable<Cluster> ReadClustersForModel(Model model)
        {
            return context.Models.Find(model.Id).Clusters.ToList();
        }

        public Feature CreateFeature(Feature feature)
        {
            feature = context.Features.Add(feature);
            context.SaveChanges();
            return feature;
        }

        public Model CreateModel(Model model)
        {
            model = context.Models.Add(model);
            context.SaveChanges();
            return model;
        }

        public Model ReadModel(long id)
        {
            return context.Models
                .Include(p => p.Clusters)
                .Include(p => p.Clusters.Select(pt => pt.DistanceToClusters))
                .Include(p => p.Clusters.Select(pt => pt.Solvents))
                .Include(p => p.Clusters.Select(pt => pt.Solvents.Select(v => v.Features)))
                .FirstOrDefault(i => i.Id == id);
        }

        public Solvent CreateSolvent(Solvent solvent)
        {
            solvent = context.Solvents.Add(solvent);
            context.SaveChanges();
            return solvent;
        }

        public ClusterDistanceCenter CreateClusterDistanceCenter(ClusterDistanceCenter clusterDistanceCenter)
        {
            clusterDistanceCenter = context.ClusterDistanceCenters.Add(clusterDistanceCenter);
            context.SaveChanges();
            return clusterDistanceCenter;
        }

        public List<Model> ReadModelsForAlgorithm(AlgorithmName algorithmName)
        {
            return context.Models.Where(m => m.AlgorithmName == algorithmName).ToList();
        }
    }
}
