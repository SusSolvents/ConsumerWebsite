using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL
{
    public class EFDbContext : DbContext
    {
        public EFDbContext() : base("sussol")
        {
            Database.SetInitializer<EFDbContext>(new EFDbInitializer());
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Organisation> Organisations { get; set; }
        public DbSet<Algorithm> Algorithms { get; set; }
        public DbSet<Analysis> Analyses { get; set; }
        public DbSet<Cluster> Clusters { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<Solvent> Solvents { get; set; }
        public DbSet<SolventMetaData> SolventMetaDatas { get; set; }
        public DbSet<ClusterDistanceCenter> ClusterDistanceCenters { get; set; }
        public DbSet<AnalysisModel> AnalysisModels { get; set; }
        public DbSet<VectorData> VectorData { get; set; }
        public DbSet<MinMaxValue> MinMaxValues { get; set; }
        public DbSet<ClassifiedInstance> ClassifiedInstances { get; set; }
        public DbSet<EHSScore> EHSScores { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
        }
    }
}
